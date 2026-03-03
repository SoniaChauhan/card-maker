/**
 * Visitors API — log page visits & retrieve visitor stats.
 * POST /api/visitors  { action: 'log', page, referrer, userAgent, ... }
 * POST /api/visitors  { action: 'stats' }  — admin only, returns visitor summary
 */
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;
    const db = await getDb();
    const col = db.collection('visitors');

    switch (action) {
      /* ── Log a page visit ── */
      case 'log': {
        const { page, referrer, screenWidth, screenHeight, language, userAgent } = body;

        // Get IP from headers (Vercel sets these)
        const forwarded = req.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown';

        await col.insertOne({
          page: page || '/',
          referrer: referrer || '',
          ip,
          userAgent: userAgent || '',
          screenWidth: screenWidth || 0,
          screenHeight: screenHeight || 0,
          language: language || '',
          visitedAt: new Date(),
        });

        return NextResponse.json({ ok: true });
      }

      /* ── Get visitor stats (admin) ── */
      case 'stats': {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Total counts
        const [totalVisits, todayVisits, weekVisits, monthVisits] = await Promise.all([
          col.countDocuments(),
          col.countDocuments({ visitedAt: { $gte: todayStart } }),
          col.countDocuments({ visitedAt: { $gte: weekAgo } }),
          col.countDocuments({ visitedAt: { $gte: monthAgo } }),
        ]);

        // Unique IPs
        const [totalUnique, todayUnique, weekUnique, monthUnique] = await Promise.all([
          col.distinct('ip').then(ips => ips.length),
          col.distinct('ip', { visitedAt: { $gte: todayStart } }).then(ips => ips.length),
          col.distinct('ip', { visitedAt: { $gte: weekAgo } }).then(ips => ips.length),
          col.distinct('ip', { visitedAt: { $gte: monthAgo } }).then(ips => ips.length),
        ]);

        // Top pages (last 30 days)
        const topPages = await col.aggregate([
          { $match: { visitedAt: { $gte: monthAgo } } },
          { $group: { _id: '$page', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]).toArray();

        // Recent visitors (last 20)
        const recentVisitors = await col
          .find()
          .sort({ visitedAt: -1 })
          .limit(20)
          .project({ _id: 0, page: 1, ip: 1, referrer: 1, language: 1, screenWidth: 1, screenHeight: 1, visitedAt: 1 })
          .toArray();

        // Daily visits (last 7 days)
        const dailyVisits = await col.aggregate([
          { $match: { visitedAt: { $gte: weekAgo } } },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' },
              },
              count: { $sum: 1 },
              uniqueIps: { $addToSet: '$ip' },
            },
          },
          { $sort: { _id: 1 } },
        ]).toArray();

        const dailyStats = dailyVisits.map(d => ({
          date: d._id,
          visits: d.count,
          unique: d.uniqueIps.length,
        }));

        return NextResponse.json({
          total: { visits: totalVisits, unique: totalUnique },
          today: { visits: todayVisits, unique: todayUnique },
          week: { visits: weekVisits, unique: weekUnique },
          month: { visits: monthVisits, unique: monthUnique },
          topPages: topPages.map(p => ({ page: p._id, count: p.count })),
          recentVisitors: recentVisitors.map(v => ({
            ...v,
            visitedAt: v.visitedAt?.toISOString?.() || v.visitedAt,
          })),
          dailyStats,
        });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Visitors API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

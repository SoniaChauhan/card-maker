import FormField from '../shared/FormField';

export default function AnniversaryForm({ data, errors, onChange, onBack, onGenerate }) {
  return (
    <div className="form-screen anniversary-form-screen">
      <div className="form-card">
        <div className="form-header">
          <span className="form-header-icon">💍</span>
          <h2>Anniversary Greeting Details</h2>
          <p>Send a beautiful anniversary wish with a personalised card.</p>
        </div>

        <div className="form-grid">
          <FormField label="Partner 1 Name" name="partner1"
            value={data.partner1} onChange={onChange}
            placeholder="First person's name" error={errors.partner1} />

          <FormField label="Partner 2 Name" name="partner2"
            value={data.partner2} onChange={onChange}
            placeholder="Second person's name" error={errors.partner2} />

          <FormField label="Years Together" name="years"
            type="number" value={data.years} onChange={onChange}
            placeholder="e.g. 10, 25, 50" min="1" />

          <FormField label="Anniversary Date" name="date"
            type="date" value={data.date} onChange={onChange}
            error={errors.date} />

          <FormField label="Blessing / Message" name="message"
            value={data.message} onChange={onChange}
            options={[
              { value: "May your bond grow deeper with each passing year. Wishing you endless love and blessings.", label: "May your bond grow deeper with each passing year. Wishing you endless love and blessings." },
              { value: "May God continue to fill your lives with joy, harmony, and togetherness. Happy Anniversary.", label: "May God continue to fill your lives with joy, harmony, and togetherness. Happy Anniversary." },
              { value: "May your journey ahead be filled with love, peace, and countless beautiful moments.", label: "May your journey ahead be filled with love, peace, and countless beautiful moments." },
              { value: "Wishing you a lifetime of affection, trust, and companionship. Stay blessed always.", label: "Wishing you a lifetime of affection, trust, and companionship. Stay blessed always." },
              { value: "May your love story inspire everyone around you. Blessings on your anniversary.", label: "May your love story inspire everyone around you. Blessings on your anniversary." },
              { value: "May the divine bless your marriage with strength, warmth, and eternal happiness.", label: "May the divine bless your marriage with strength, warmth, and eternal happiness." },
              { value: "May you walk hand‑in‑hand through every joy and challenge. Happy Anniversary.", label: "May you walk hand‑in‑hand through every joy and challenge. Happy Anniversary." },
              { value: "Wishing you more laughter, more love, and more shared dreams in the years ahead.", label: "Wishing you more laughter, more love, and more shared dreams in the years ahead." },
              { value: "May your hearts stay forever connected in love and devotion. Anniversary blessings.", label: "May your hearts stay forever connected in love and devotion. Anniversary blessings." },
              { value: "May every moment of your life together be filled with God's grace and blessings.", label: "May every moment of your life together be filled with God's grace and blessings." },
              { value: "May your love grow stronger each year, filling your home with happiness and peace.", label: "May your love grow stronger each year, filling your home with happiness and peace." },
              { value: "May you always find comfort in each other's arms. Many blessings on your anniversary.", label: "May you always find comfort in each other's arms. Many blessings on your anniversary." },
              { value: "May your relationship always be protected, cherished, and guided by the divine.", label: "May your relationship always be protected, cherished, and guided by the divine." },
              { value: "Wishing you a lifetime of shared smiles and precious memories. Stay blessed.", label: "Wishing you a lifetime of shared smiles and precious memories. Stay blessed." },
              { value: "May love be the foundation of your marriage and joy its beautiful companion.", label: "May love be the foundation of your marriage and joy its beautiful companion." },
              { value: "May your togetherness thrive through every season of life. Happy Anniversary.", label: "May your togetherness thrive through every season of life. Happy Anniversary." },
              { value: "Wishing you blessings of health, harmony, and everlasting love.", label: "Wishing you blessings of health, harmony, and everlasting love." },
              { value: "May your union shine brighter with every passing year. Blessings to both of you.", label: "May your union shine brighter with every passing year. Blessings to both of you." },
              { value: "May your home always echo with laughter and affection. Happy Anniversary.", label: "May your home always echo with laughter and affection. Happy Anniversary." },
              { value: "May your marriage be blessed with warmth, trust, and endless understanding.", label: "May your marriage be blessed with warmth, trust, and endless understanding." },
              { value: "May God bless your journey with strength and serenity. Happy Anniversary to you both.", label: "May God bless your journey with strength and serenity. Happy Anniversary to you both." },
              { value: "May your love remain as inspiring and pure as the day it began.", label: "May your love remain as inspiring and pure as the day it began." },
              { value: "Blessings to the wonderful couple—may your hearts remain forever one.", label: "Blessings to the wonderful couple—may your hearts remain forever one." },
              { value: "May every passing year bring you closer and fill your life with joy.", label: "May every passing year bring you closer and fill your life with joy." },
              { value: "Wishing you abundant blessings and a lifetime of unbreakable love.", label: "Wishing you abundant blessings and a lifetime of unbreakable love." },
              { value: "May your companionship flourish beautifully with each new chapter.", label: "May your companionship flourish beautifully with each new chapter." },
              { value: "May you be blessed with health, happiness, and enduring devotion.", label: "May you be blessed with health, happiness, and enduring devotion." },
              { value: "May the love you share today continue to illuminate your future.", label: "May the love you share today continue to illuminate your future." },
              { value: "Your bond is beautiful—may it keep growing with time. Happy Anniversary.", label: "Your bond is beautiful—may it keep growing with time. Happy Anniversary." },
              { value: "May your marriage always be surrounded by blessings, peace, and affection.", label: "May your marriage always be surrounded by blessings, peace, and affection." },
              { value: "May your love remain unwavering through all of life's moments. Anniversary blessings.", label: "May your love remain unwavering through all of life's moments. Anniversary blessings." },
              { value: "Wishing you a relationship filled with faith, respect, and deep affection.", label: "Wishing you a relationship filled with faith, respect, and deep affection." },
              { value: "May your hearts stay forever young in love. Happy Anniversary.", label: "May your hearts stay forever young in love. Happy Anniversary." },
              { value: "May God bless you with endless understanding and shared dreams.", label: "May God bless you with endless understanding and shared dreams." },
              { value: "May your love story sparkle brighter with each new year.", label: "May your love story sparkle brighter with each new year." },
              { value: "Wishing you blessings of joy today and every day of your journey together.", label: "Wishing you blessings of joy today and every day of your journey together." },
              { value: "May the divine shower your marriage with warmth and positivity.", label: "May the divine shower your marriage with warmth and positivity." },
              { value: "May your togetherness be filled with strength, trust, and harmony.", label: "May your togetherness be filled with strength, trust, and harmony." },
              { value: "May you continue to walk side by side through every joy and challenge.", label: "May you continue to walk side by side through every joy and challenge." },
              { value: "Wishing you peace, joy, and cherished moments forever.", label: "Wishing you peace, joy, and cherished moments forever." },
              { value: "May the love you share bring you endless blessings and happiness.", label: "May the love you share bring you endless blessings and happiness." },
              { value: "Your bond is a blessing—may it flourish beautifully forever.", label: "Your bond is a blessing—may it flourish beautifully forever." },
              { value: "Wishing you countless years of deep love and heartfelt togetherness.", label: "Wishing you countless years of deep love and heartfelt togetherness." },
              { value: "May your anniversary be a reminder of the blessings of love you share.", label: "May your anniversary be a reminder of the blessings of love you share." },
              { value: "May God gift you both a lifetime filled with love and joy.", label: "May God gift you both a lifetime filled with love and joy." },
              { value: "May your union be blessed with prosperity, harmony, and strength.", label: "May your union be blessed with prosperity, harmony, and strength." },
              { value: "Wishing you blessings today that remain with you for a lifetime.", label: "Wishing you blessings today that remain with you for a lifetime." },
              { value: "May your love never fade and your companionship never weaken.", label: "May your love never fade and your companionship never weaken." },
              { value: "May this anniversary bring abundant blessings and sweet memories.", label: "May this anniversary bring abundant blessings and sweet memories." },
              { value: "May the years ahead be filled with joy, unity, and everlasting love.", label: "May the years ahead be filled with joy, unity, and everlasting love." },
            ]}
            span />
        </div>

        {/* — Photo Upload — */}
        <div className="form-stack" style={{ marginBottom: 0 }}>
          <div className="card-photo-upload">
            <label htmlFor="anniv-photo">
              📷 Upload Couple Photo <span className="optional">(optional)</span>
            </label>
            <input type="file" id="anniv-photo" name="photo" accept="image/*" onChange={onChange} />
            {data.photoPreview && (
              <img src={data.photoPreview} alt="Preview" className="card-photo-preview card-photo-preview--heart" />
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-back-form" onClick={onBack}>← Back</button>
          <button
            className="btn-generate"
            onClick={onGenerate}
            style={{ background: 'linear-gradient(135deg,#1a2a5e,#c9a84c)', color: '#fff', boxShadow: '0 8px 24px rgba(201,168,76,.4)' }}
          >
            💖 Generate Card
          </button>
        </div>
      </div>
    </div>
  );
}

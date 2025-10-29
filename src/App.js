import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [textData, setTextData] = useState("");
  const [vcard, setVcard] = useState({
    firstName: "",
    lastName: "",
    org: "",
    title: "",
    phone: "",
    email: "",
    address: "",
    website: "",
  });
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState(null);

  const makeVCard = () => {
    const v = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${vcard.lastName};${vcard.firstName};;;`,
      `FN:${vcard.firstName} ${vcard.lastName}`.trim(),
    ];
    if (vcard.org) v.push(`ORG:${vcard.org}`);
    if (vcard.title) v.push(`TITLE:${vcard.title}`);
    if (vcard.phone) v.push(`TEL;TYPE=CELL:${vcard.phone}`);
    if (vcard.email) v.push(`EMAIL;TYPE=INTERNET:${vcard.email}`);
    if (vcard.address) v.push(`ADR;TYPE=WORK:;;${vcard.address};;;;`);
    if (vcard.website) v.push(`URL:${vcard.website}`);
    v.push("END:VCARD");
    return v.join("\n");
  };

  const qrValue = activeTab === 0 ? textData.trim() : makeVCard();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = () => {
    const canvas = document.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="max-w-md mx-auto p-4 min-h-screen flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center mt-2 mb-4">
        QR Code Generator
      </h1>

      <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
        <TabList className="flex justify-center border-b border-gray-200 mb-4">
          <Tab selectedClassName="border-b-2 border-blue-500 font-semibold px-3">
            Tekst / Link
          </Tab>
          <Tab selectedClassName="border-b-2 border-blue-500 font-semibold px-3">
            Wizytówka (vCard)
          </Tab>
        </TabList>

        {/* --- TEXT/LINK TAB --- */}
        <TabPanel>
          <textarea
            value={textData}
            onChange={(e) => setTextData(e.target.value)}
            placeholder="Wpisz tekst lub link..."
            className="w-full border rounded-lg p-3 text-sm h-24 focus:ring-2 focus:ring-blue-400"
          />
        </TabPanel>

        {/* --- VCARD TAB --- */}
        <TabPanel>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(vcard).map(([key, val]) => (
              <input
                key={key}
                type="text"
                value={val}
                onChange={(e) => setVcard({ ...vcard, [key]: e.target.value })}
                placeholder={key
                  .replace("firstName", "Imię")
                  .replace("lastName", "Nazwisko")
                  .replace("org", "Firma")
                  .replace("title", "Tytuł")
                  .replace("phone", "Telefon")
                  .replace("email", "Email")
                  .replace("address", "Adres")
                  .replace("website", "Strona")}
                className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>
        </TabPanel>
      </Tabs>

      {/* SETTINGS */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <h2 className="text-lg font-semibold mb-2">Ustawienia QR</h2>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <label>Kolor kodu:</label>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <label>Kolor tła:</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <label>Logo:</label>
            <input type="file" accept="image/*" onChange={handleLogoChange} />
          </div>
        </div>
      </div>

      {/* QR PREVIEW */}
      <div className="bg-white rounded-xl p-4 shadow-md flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold">Podgląd QR</h2>
        {qrValue ? (
          <div className="relative">
            <QRCodeCanvas
              id="qr-gen"
              value={qrValue}
              size={220}
              fgColor={fgColor}
              bgColor={bgColor}
              includeMargin={true}
              imageSettings={
                logo
                  ? {
                      src: logo,
                      height: 40,
                      width: 40,
                      excavate: true,
                    }
                  : undefined
              }
            />
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Wpisz dane, aby wygenerować QR</p>
        )}
        <button
          onClick={downloadQR}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Zapisz jako PNG
        </button>
      </div>

      <footer className="text-xs text-center text-gray-500 mt-4">
        Dodaj do ekranu głównego, aby używać jak aplikacji 📱
      </footer>
    </div>
  );
}

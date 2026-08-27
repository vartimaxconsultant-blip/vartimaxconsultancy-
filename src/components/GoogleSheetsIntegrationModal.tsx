import React, { useState } from 'react';
import { X, Copy, Check, Table, Cloud, ExternalLink, ShieldCheck } from 'lucide-react';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsIntegrationModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const appsScriptCode = `/**
 * VartiMax Consultant - Google Sheets & Drive Webhook Integration Script
 * Copy & Paste this script into Google Sheets > Extensions > Apps Script
 * Deploy as Web App -> Access: "Anyone"
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Auto-create header row if sheet is brand new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Lead / Reference ID",
        "Full Name",
        "WhatsApp Number",
        "Target Country",
        "Visa Category",
        "Travel / Intake Date",
        "Uploaded Documents Count",
        "Status"
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#0B2545").setFontColor("#FFFFFF");
    }
    
    // Append the incoming lead / client intake row
    var timestamp = new Date();
    var refId = data.referenceId || ("LEAD-" + Math.floor(10000 + Math.random() * 90000));
    var fullName = data.fullName || "";
    var whatsapp = data.whatsapp || "";
    var country = data.targetCountry || "";
    var visaType = data.visaType || data.category || "visit";
    var intakeDate = data.intakeDate || "";
    var docsCount = (data.documents && data.documents.length) ? data.documents.length : 0;
    var status = data.status || "New Lead (Pending Call)";
    
    sheet.appendRow([
      timestamp,
      refId,
      fullName,
      whatsapp,
      country,
      visaType,
      intakeDate,
      docsCount,
      status
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "refId": refId }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051C3A]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#07244A] rounded-2xl shadow-2xl border border-[#15488A] max-w-2xl w-full overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col text-[#E5E5E5]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#051C3A] via-[#092E5E] to-[#0D3870] border-b border-[#123A6D] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Google Sheets & Drive Integration Code
              </h3>
              <p className="text-xs text-[#93C5FD]">
                Real-time 2-way lead capture & document intake pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#93C5FD] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#D1D5DB]">
          <div className="bg-[#061F40] p-4 rounded-xl border border-[#15488A] space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>3-Minute Google Apps Script Deployment Guide:</span>
            </h4>
            <ol className="list-decimal pl-5 space-y-1.5 text-[#D1D5DB]">
              <li>Create a new Google Sheet named <strong className="text-white">"VartiMax Consultant Client Leads"</strong>.</li>
              <li>Click <strong className="text-white">Extensions &gt; Apps Script</strong> from the top menu.</li>
              <li>Paste the code snippet below into <code>Code.gs</code> and click <strong className="text-white">Save</strong>.</li>
              <li>Click <strong className="text-white">Deploy &gt; New deployment</strong>, select <strong className="text-white">Web app</strong>, choose <em>Who has access: Anyone</em>, and click <strong className="text-white">Deploy</strong>.</li>
              <li>All website leads, assessment submissions, and client uploads will sync instantly!</li>
            </ol>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between bg-[#051C3A] text-[#93C5FD] px-4 py-2 rounded-t-xl text-xs font-mono border-t border-x border-[#15488A]">
              <span>Google Apps Script (Code.gs)</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] px-2.5 py-1 rounded font-bold transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>
            <pre className="bg-[#04152C] text-[#E0E7FF] border border-[#15488A] p-4 rounded-b-xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-56">
              {appsScriptCode}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#061F40] border-t border-[#123A6D] px-6 py-3 flex items-center justify-between">
          <span className="text-[11px] text-[#93C5FD]/70">
            Powered by VartiMax Fullstack Webhook Engine
          </span>
          <button
            onClick={onClose}
            className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

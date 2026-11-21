import { NextRequest, NextResponse } from "next/server";
import { getWaitlistEntries, getContactMessages } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "waitlist";

    if (type === "contacts") {
      const contacts = getContactMessages();
      let csv = "ID,Name,Email,Subject,Interest,Status,Created At,Message\n";
      for (const c of contacts) {
        const safeMsg = `"${c.message.replace(/"/g, '""')}"`;
        const safeSubj = `"${c.subject.replace(/"/g, '""')}"`;
        csv += `${c.id},"${c.name}","${c.email}",${safeSubj},"${c.interest || ""}","${c.status}","${c.created_at}",${safeMsg}\n`;
      }

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="orbitx-contacts-${Date.now()}.csv"`,
        },
      });
    }

    const waitlist = getWaitlistEntries();
    let csv = "ID,Name,Email,Company,Role,Team Size,Status,Created At,Use Case,Notes\n";
    for (const w of waitlist) {
      const safeNotes = `"${(w.notes || "").replace(/"/g, '""')}"`;
      const safeUseCase = `"${(w.use_case || "").replace(/"/g, '""')}"`;
      csv += `${w.id},"${w.name}","${w.email}","${w.company || ""}","${w.role || ""}","${w.team_size || ""}","${w.status}","${w.created_at}",${safeUseCase},${safeNotes}\n`;
    }

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orbitx-waitlist-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to generate CSV export" }, { status: 500 });
  }
}

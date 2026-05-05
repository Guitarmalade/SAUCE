import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir = "/Users/chrisschreiner/sauce/outputs/guitarmalade-outreach-2026-05-03";
const outputPath = `${outputDir}/guitarmalade-outreach-greenwich-ct.xlsx`;

const rows = [
  {
    priority: "High",
    organization: "Round Hill Music Co.",
    category: "Store / retail business",
    city: "Greenwich",
    state: "CT",
    drive: "5-10 min",
    fit: "Programs/events",
    contact: "Round Hill Music Co. team",
    role: "General store contact",
    email: "hello@roundhillmusicco.com",
    emailStatus: "Verified",
    phone: "475-328-2298",
    why: "Local guitar-focused store with an in-store stage for performances, artist clinics, and brand activations.",
    note: "Best hyper-local first stop for a guitar-centered workshop pitch.",
    programUrl: "https://roundhillmusicco.com/pages/visit",
    contactUrl: "https://roundhillmusicco.com/pages/contact-rhmc",
    sourceNote: "Official site says the in-store stage hosts intimate performances, VIP events, artist clinics, and brand activations.",
  },
  {
    priority: "High",
    organization: "Giuliano's School of Music",
    category: "Store / retail business",
    city: "Stamford",
    state: "CT",
    drive: "20-25 min",
    fit: "Programs/events",
    contact: "Giuliano's music school administrators",
    role: "General school contact",
    email: "gmusiccenter@aol.com",
    emailStatus: "Verified",
    phone: "203-286-8005",
    why: "Lower Fairfield County music school/store with lessons, master theory classes, rentals, and repairs.",
    note: "General site pushes contact forms; public email appears on the official alternate contact page.",
    programUrl: "https://www.giulianosmusiccenter.com/music-instruction",
    contactUrl: "https://www.giulianosmusiccenter.com/copy-of-contact-us",
    sourceNote: "Official site highlights private music lessons and master theory classes; alternate official contact page lists email.",
  },
  {
    priority: "High",
    organization: "The Gig Center at Westport",
    category: "Store / retail business",
    city: "Westport",
    state: "CT",
    drive: "35-40 min",
    fit: "Programs/events",
    contact: "Chris Cass",
    role: "Lessons and scheduling contact",
    email: "chris@gigcenterwestport.com",
    emailStatus: "Verified",
    phone: "203-292-8934",
    why: "Local music school/repair business already tied into area teachers, parents, and school music programs.",
    note: "Good fit for a practical guitar workshop or clinic pitch tied to lessons and community events.",
    programUrl: "https://www.gigcenterwestport.com/store/",
    contactUrl: "https://www.gigcenterwestport.com/contact/",
    sourceNote: "Official site describes the business as primarily a music school and instrument repair facility with lesson scheduling through Chris Cass.",
  },
  {
    priority: "High",
    organization: "Westport School of Music",
    category: "School / arts org",
    city: "Westport",
    state: "CT",
    drive: "35-40 min",
    fit: "Explicit workshops",
    contact: "Sarah Miller",
    role: "Director",
    email: "smiller@wsmusic.org",
    emailStatus: "Verified",
    phone: "203-227-4931",
    why: "Community music school with a Songwriters' Workshop and active local partnerships.",
    note: "Strong fit if you want a structured music-school workshop audience in Fairfield County.",
    programUrl: "https://wsmusic.org/programs",
    contactUrl: "https://wsmusic.org/contact",
    sourceNote: "Official program page includes the Songwriters' Workshop; official contact page lists Sarah Miller's email.",
  },
  {
    priority: "High",
    organization: "Suzuki Music Schools",
    category: "School / arts org",
    city: "Westport",
    state: "CT",
    drive: "35-40 min",
    fit: "Explicit workshops",
    contact: "Suzuki Schools office",
    role: "Main office",
    email: "office@suzukischools.org",
    emailStatus: "Verified",
    phone: "203-227-9474",
    why: "Runs the Da Capo Visiting Artist Series with lessons/master classes and organizes the Connecticut Guitar Festival.",
    note: "Excellent target for a guitar-specific workshop or guest artist day.",
    programUrl: "https://suzukischools.org/da-capo-series/",
    contactUrl: "https://suzukischools.org/contact-us/",
    sourceNote: "Official site says the Da Capo Visiting Artist Series exposes children to leading artists through lessons and master classes.",
  },
  {
    priority: "High",
    organization: "School of Rock Fairfield",
    category: "School / arts org",
    city: "Fairfield",
    state: "CT",
    drive: "50-60 min",
    fit: "Programs/events",
    contact: "Michael Knobloch",
    role: "General Manager",
    email: "fairfield@schoolofrock.com",
    emailStatus: "Verified",
    phone: "203-292-5473",
    why: "Actively runs camps, workshops, songwriting, adult programs, and guitar instruction.",
    note: "High-probability outreach target if Guitarmalade can frame the offer as performance-based or songwriting-friendly.",
    programUrl: "https://www.schoolofrock.com/locations/fairfield/music-camps",
    contactUrl: "https://www.schoolofrock.com/locations/fairfield",
    sourceNote: "Official location page lists camps/workshops and identifies Michael Knobloch as General Manager.",
  },
  {
    priority: "High",
    organization: "Hoff-Barthelson Music School",
    category: "School / arts org",
    city: "Scarsdale",
    state: "NY",
    drive: "35-45 min",
    fit: "Explicit workshops",
    contact: "Gabriella Sanna / HBMS office",
    role: "Executive Director / general office",
    email: "hb@hbms.org; registration@hbms.org",
    emailStatus: "Verified",
    phone: "914-723-1169",
    why: "Long-running Westchester music school with dedicated master classes, workshops, and performance programming.",
    note: "Very strong fit for a guest workshop/masterclass proposal.",
    programUrl: "https://hbms.org/master-classes/",
    contactUrl: "https://hbms.org/contact/",
    sourceNote: "Official pages emphasize master classes and workshops as core parts of the student experience.",
  },
  {
    priority: "High",
    organization: "Concordia Conservatory",
    category: "School / arts org",
    city: "Stamford",
    state: "CT",
    drive: "20-25 min",
    fit: "Explicit workshops",
    contact: "Kathleen Suss",
    role: "Executive Director",
    email: "ksuss@concordiaconservatory.org",
    emailStatus: "Verified",
    phone: "203-595-5059",
    why: "Community conservatory serving Fairfield and Westchester with summer programs and official masterclass history.",
    note: "Good near-market target; current site emphasizes broad music programming while official archives show masterclass activity.",
    programUrl: "https://www.concordiaconservatory.org/programs/summer-programs",
    contactUrl: "https://www.concordiaconservatory.org/about/contact-us",
    sourceNote: "Official current site highlights youth/adult/summer programs; official archive pages and press releases document master classes.",
  },
  {
    priority: "High",
    organization: "A.C.T. of CT",
    category: "School / arts org",
    city: "Ridgefield",
    state: "CT",
    drive: "40-50 min",
    fit: "Explicit workshops",
    contact: "Education team",
    role: "Workshop booking / education",
    email: "education@actofct.org",
    emailStatus: "Verified",
    phone: "475-215-5433",
    why: "Explicitly books masterclasses and custom workshops for schools and organizations.",
    note: "Thematic fit is broader performing arts, but the organization already handles custom education programming.",
    programUrl: "https://www.actofct.org/masterclasses-school-workshops",
    contactUrl: "https://www.actofct.org/community",
    sourceNote: "Official site says A.C.T. of CT can coordinate group workshop opportunities individually with a school, class, or organization.",
  },
  {
    priority: "High",
    organization: "Music Theatre of Connecticut",
    category: "School / arts org",
    city: "Norwalk",
    state: "CT",
    drive: "25-30 min",
    fit: "Explicit workshops",
    contact: "MTC admin",
    role: "Box office / school office",
    email: "admin@musictheatreofct.com",
    emailStatus: "Verified",
    phone: "203.454.3883",
    why: "Runs summer workshops, special master classes, private lessons, and conservatory training.",
    note: "Not guitar-specific, but already structured around outside teaching artists and workshop-style programming.",
    programUrl: "https://www.musictheatreofct.com/school-summer",
    contactUrl: "https://www.musictheatreofct.com/contactus",
    sourceNote: "Official site says the school offers summer workshops and special master classes.",
  },
  {
    priority: "High",
    organization: "Caramoor Center for Music and the Arts",
    category: "School / arts org",
    city: "Katonah",
    state: "NY",
    drive: "40-50 min",
    fit: "Explicit workshops",
    contact: "Hallie Eichholz",
    role: "Artistic Department Coordinator",
    email: "hallie@caramoor.org",
    emailStatus: "Verified",
    phone: "914.767.3830",
    why: "Student Strings program already delivers class visits, workshop intensives, discussions, and performances.",
    note: "Best positioned if the workshop can be pitched as a school-visit or educational residency.",
    programUrl: "https://caramoor.org/education/school-programs/",
    contactUrl: "https://caramoor.org/contact-us/",
    sourceNote: "Official education pages invite schools to contact Hallie Eichholz about Student Strings workshop intensives.",
  },
  {
    priority: "High",
    organization: "Greenwich House Music School",
    category: "School / arts org",
    city: "New York",
    state: "NY",
    drive: "1 hr 20-40 min",
    fit: "Explicit workshops",
    contact: "Rachel Black",
    role: "Director",
    email: "rblack@greenwichhouse.org",
    emailStatus: "Verified",
    phone: "212-242-4770",
    why: "Community music school with adult workshops/master classes and flexible event/community programming.",
    note: "Strong fit for an artist-led workshop with a community-school angle.",
    programUrl: "https://greenwichhouse.org/music-school/classes/adult-programs/",
    contactUrl: "https://greenwichhouse.org/music-school/contact-greenwich-house-music-school/",
    sourceNote: "Official site lists workshops and master classes and publishes director Rachel Black's email.",
  },
  {
    priority: "High",
    organization: "Third Street Music School Settlement",
    category: "School / arts org",
    city: "New York",
    state: "NY",
    drive: "1 hr 25-45 min",
    fit: "Explicit workshops",
    contact: "Student Services / Loyi Malu",
    role: "Director, Student Services, Inclusion & Engagement",
    email: "student.services@thirdstreet.nyc",
    emailStatus: "Verified",
    phone: "212-777-3240",
    why: "Runs adult performance and chamber music workshops plus guest master-class activity.",
    note: "Good community-school option if the pitch focuses on access, adults, or cross-genre learning.",
    programUrl: "https://musicanddance.thirdstreet.nyc/adult-programs",
    contactUrl: "https://www.thirdstreet.nyc/",
    sourceNote: "Official adult programs page lists workshop offerings; official site publishes Student Services contact info.",
  },
  {
    priority: "High",
    organization: "Kaufman Music Center / Lucy Moses School",
    category: "School / arts org",
    city: "New York",
    state: "NY",
    drive: "1 hr 20-40 min",
    fit: "Explicit workshops",
    contact: "Igal Kesselman",
    role: "Director, Lucy Moses School",
    email: "lucymosesschool@kaufmanmusiccenter.org",
    emailStatus: "Verified",
    phone: "212-501-3360",
    why: "Hosts workshops and masterclasses across Lucy Moses School, Merkin Hall, and related Kaufman programs.",
    note: "Good target if you want a polished NYC community-arts school partner.",
    programUrl: "https://www.kaufmanmusiccenter.org/lms/",
    contactUrl: "https://www.kaufmanmusiccenter.org/contact/",
    sourceNote: "Official pages list Lucy Moses School contact info and identify Igal Kesselman as Director.",
  },
  {
    priority: "Medium",
    organization: "Purchase College Conservatory of Music",
    category: "College / conservatory",
    city: "Purchase",
    state: "NY",
    drive: "30-40 min",
    fit: "Institutional outreach",
    contact: "Conservatory office / Sue Fleishaker",
    role: "Conservatory coordinator",
    email: "music@purchase.edu",
    emailStatus: "Verified",
    phone: "914-251-6700",
    why: "Official pages state guest musicians regularly visit campus for master classes and lectures.",
    note: "More institutional and selective, but very close geographically and worth a faculty/outreach pitch.",
    programUrl: "https://www.purchase.edu/academics/music/",
    contactUrl: "https://www.purchase.edu/academics/music/music-faq/",
    sourceNote: "Official conservatory pages describe guest musicians visiting for master classes; official FAQ page lists the contact email.",
  },
  {
    priority: "Medium",
    organization: "Yale School of Music / Music in Schools Initiative",
    category: "College / conservatory",
    city: "New Haven",
    state: "CT",
    drive: "1 hr 20-35 min",
    fit: "Institutional outreach",
    contact: "Jenny Quian Lopez",
    role: "Manager, Music in Schools Initiative",
    email: "jennifer.quianlopez@yale.edu; musicinschools@yale.edu",
    emailStatus: "Verified",
    phone: "",
    why: "Yale guitar program includes guest-artist masterclasses; Music in Schools Initiative already connects music education to the community.",
    note: "Best approached as an education/outreach collaboration rather than a retail-style clinic.",
    programUrl: "https://music.yale.edu/music-schools-initiative",
    contactUrl: "https://music.yale.edu/staff-directory",
    sourceNote: "Official Yale pages list the Music in Schools Initiative and identify guitar masterclass activity.",
  },
  {
    priority: "Medium",
    organization: "Mannes School of Music",
    category: "College / conservatory",
    city: "New York",
    state: "NY",
    drive: "1 hr 20-40 min",
    fit: "Institutional outreach",
    contact: "College of Performing Arts Office of Admission",
    role: "General contact",
    email: "performingarts@newschool.edu; admission@newschool.edu",
    emailStatus: "Verified",
    phone: "212.229.5150",
    why: "Official pages reference master classes, seminars, and special programs tied to the conservatory.",
    note: "Likely a longer-shot outreach path unless there is a strong faculty or youth-program fit.",
    programUrl: "https://www.newschool.edu/mannes/special-programs/",
    contactUrl: "https://www.newschool.edu/mannes/admission/contact-us/",
    sourceNote: "Official Mannes pages reference master classes and workshops; official contact page lists performingarts@newschool.edu.",
  },
  {
    priority: "Medium",
    organization: "Manhattan School of Music",
    category: "College / conservatory",
    city: "New York",
    state: "NY",
    drive: "1 hr 30-45 min",
    fit: "Institutional outreach",
    contact: "Chris Vaughn / CCRCI",
    role: "Director, Center for Career Readiness & Community Impact",
    email: "centerforimpact@msmnyc.edu",
    emailStatus: "Verified",
    phone: "917-493-4502",
    why: "MSM's community impact programs place teaching artists in schools and community centers; school also hosts public master classes.",
    note: "Best pitched as a school/community engagement workshop or youth-education collaboration.",
    programUrl: "https://www.msmnyc.edu/programs/the-center-for-career-readiness-and-community-impact/community-impact/",
    contactUrl: "https://www.msmnyc.edu/programs/the-center-for-career-readiness-and-community-impact/",
    sourceNote: "Official MSM pages describe community teaching and performance partnerships and list CCRCI contact emails.",
  },
  {
    priority: "Medium",
    organization: "Juilliard Office of Community Engagement",
    category: "College / conservatory",
    city: "New York",
    state: "NY",
    drive: "1 hr 20-40 min",
    fit: "Institutional outreach",
    contact: "Office of Community Engagement / Adrian Rodriguez",
    role: "Director of Community Engagement",
    email: "communityengagement@juilliard.edu (inferred; verify)",
    emailStatus: "Inferred",
    phone: "(212) 799-5000 ext. 298",
    why: "Official page explicitly invites outside organizations to contact Juilliard about community engagement programming; guitar fellowship includes master classes.",
    note: "Email is inferred from the office name because the official page obfuscates the address in plain text. Verify on the contact page before sending.",
    programUrl: "https://www.juilliard.edu/stage-beyond/office-community-engagement",
    contactUrl: "https://www.juilliard.edu/stage-beyond/office-community-engagement",
    sourceNote: "Official page explicitly asks organizations interested in programming to contact the Office of Community Engagement and lists staff roles.",
  },
  {
    priority: "Medium",
    organization: "Hartt School Community Division",
    category: "College / conservatory",
    city: "West Hartford",
    state: "CT",
    drive: "1 hr 50-2 hr",
    fit: "Explicit workshops",
    contact: "Hartt Community Division office",
    role: "General program office",
    email: "harttcomm@hartford.edu",
    emailStatus: "Verified",
    phone: "860.768.4451",
    why: "Runs Suzuki guitar workshops and mini-workshops for music teachers through a respected college-affiliated program.",
    note: "At the edge of the radius, but clearly workshop-oriented and guitar-relevant.",
    programUrl: "https://www.hartford.edu/hartt-community-division/music/Suzuki-workshops%20.aspx",
    contactUrl: "https://www.hartford.edu/hartt-community-division/about/default.aspx",
    sourceNote: "Official Hartt pages list Suzuki guitar workshops and the main community division contact email.",
  },
  {
    priority: "Medium",
    organization: "Steinway & Sons Greenwich",
    category: "Store / retail business",
    city: "Old Greenwich",
    state: "CT",
    drive: "10-15 min",
    fit: "Programs/events",
    contact: "Showroom team",
    role: "General showroom contact",
    email: "Official contact page / phone only",
    emailStatus: "Phone/Form only",
    phone: "203-227-8222",
    why: "Official showroom page says it offers programs and services for music educators, pianists, patrons, and institutions.",
    note: "Useful local relationship target, but the official showroom pages do not publish a plain-text general email.",
    programUrl: "https://www.steinwayct.com/education",
    contactUrl: "https://www.steinwayct.com/locations/greenwich",
    sourceNote: "Official Greenwich showroom pages mention educator/student programs and direct visitors to contact by phone or form.",
  },
  {
    priority: "Medium",
    organization: "The Muzic Store",
    category: "Store / retail business",
    city: "Dobbs Ferry",
    state: "NY",
    drive: "50-60 min",
    fit: "Programs/events",
    contact: "Store team / lessons desk",
    role: "General store contact",
    email: "Official contact page / phone only",
    emailStatus: "Phone/Form only",
    phone: "914-693-3200",
    why: "Store says it started as a music school and currently offers private/group lessons plus repair and recording services.",
    note: "Relevant business target, but the official site does not publish a plain-text public email.",
    programUrl: "https://www.muzicstore.com/services.html",
    contactUrl: "https://www.muzicstore.com/contact-and-hours.html",
    sourceNote: "Official site highlights lessons and says the business began as a music school; contact page shows phone and address only.",
  },
];

const workbook = Workbook.create();
const summary = workbook.worksheets.add("Summary");
const outreach = workbook.worksheets.add("Outreach");
const sources = workbook.worksheets.add("Sources");

function styleTitle(range, fillColor = "#1F4E78", fontColor = "#FFFFFF") {
  range.format.fill.color = fillColor;
  range.format.font.bold = true;
  range.format.font.size = 16;
  range.format.font.color = fontColor;
}

function styleHeader(range, fillColor = "#D9EAF7") {
  range.format.fill.color = fillColor;
  range.format.font.bold = true;
}

function styleSectionHeader(range) {
  range.format.fill.color = "#E2F0D9";
  range.format.font.bold = true;
}

function styleBox(range) {
  range.format.fill.color = "#F8FBFF";
}

// Summary sheet
summary.getRange("A1:H1").merge();
summary.getRange("A1").values = [["Guitarmalade Outreach Targets Near Greenwich, CT"]];
styleTitle(summary.getRange("A1:H1"));

summary.getRange("A2:H2").merge();
summary.getRange("A2").values = [[
  "Workbook built on May 3, 2026. Prioritized organizations within roughly a 2-hour drive that show workshop/masterclass activity or are practical local partners for a guitar workshop.",
]];
summary.getRange("A2:H2").format.wrapText = true;
summary.getRange("A2:H2").format.fill.color = "#F4F8FB";
summary.getRange("1:1").format.rowHeight = 28;
summary.getRange("2:2").format.rowHeight = 42;

summary.getRange("A4:A8").values = [
  ["Total targets"],
  ["High priority"],
  ["Medium priority"],
  ["Rows with sendable email"],
  ["Phone/form only"],
];
summary.getRange("B4:B8").formulas = [
  ["=COUNTA(Outreach!B:B)-1"],
  ['=COUNTIF(Outreach!A:A,"High")'],
  ['=COUNTIF(Outreach!A:A,"Medium")'],
  ['=COUNTIF(Outreach!K:K,"<>Phone/Form only")'],
  ['=COUNTIF(Outreach!K:K,"Phone/Form only")'],
];
styleSectionHeader(summary.getRange("A4:B4"));
styleBox(summary.getRange("A4:B8"));
summary.getRange("A4:B8").format.font.size = 11;
summary.getRange("B4:B8").format.font.bold = true;

summary.getRange("A11:B14").values = [
  ["Category", "Count"],
  ["Store / retail business", null],
  ["School / arts org", null],
  ["College / conservatory", null],
];
summary.getRange("B12:B14").formulas = [
  ['=COUNTIF(Outreach!C:C,A12)'],
  ['=COUNTIF(Outreach!C:C,A13)'],
  ['=COUNTIF(Outreach!C:C,A14)'],
];
styleHeader(summary.getRange("A11:B11"), "#FCE4D6");
styleBox(summary.getRange("A12:B14"));

summary.getRange("D11:E13").values = [
  ["State", "Count"],
  ["CT", null],
  ["NY", null],
];
summary.getRange("E12:E13").formulas = [
  ['=COUNTIF(Outreach!E:E,D12)'],
  ['=COUNTIF(Outreach!E:E,D13)'],
];
styleHeader(summary.getRange("D11:E11"), "#FCE4D6");
styleBox(summary.getRange("D12:E13"));

summary.getRange("D4:E8").values = [
  ["Email status", "Count"],
  ["Verified", null],
  ["Inferred", null],
  ["Phone/Form only", null],
  ["", ""],
];
summary.getRange("E5:E7").formulas = [
  ['=COUNTIF(Outreach!K:K,D5)'],
  ['=COUNTIF(Outreach!K:K,D6)'],
  ['=COUNTIF(Outreach!K:K,D7)'],
];
styleHeader(summary.getRange("D4:E4"), "#FFF2CC");
styleBox(summary.getRange("D5:E7"));

summary.charts.add("ColumnClustered", summary.getRange("A11:B14"), "Auto");
const chart = summary.charts.items[0];
chart.title.text = "Targets by Category";
chart.setPosition(summary.getRange("F3:M16"));
chart.width = 520;
chart.height = 280;
chart.hasLegend = false;

summary.freezePanes.freezeRows(2);
summary.getRange("A:A").format.columnWidth = 24;
summary.getRange("B:B").format.columnWidth = 14;
summary.getRange("D:D").format.columnWidth = 18;
summary.getRange("E:E").format.columnWidth = 12;
summary.getRange("F:M").format.columnWidth = 12;

// Outreach sheet
const outreachHeaders = [[
  "Priority",
  "Organization",
  "Category",
  "City",
  "State",
  "Approx Drive",
  "Workshop Fit",
  "Contact Name / Dept",
  "Role",
  "Email / Digital Contact",
  "Email Status",
  "Phone",
  "Why It Fits",
  "Outreach Note",
]];

outreach.getRange(`A1:N${rows.length + 1}`).values = [
  ...outreachHeaders,
  ...rows.map((row) => [
    row.priority,
    row.organization,
    row.category,
    row.city,
    row.state,
    row.drive,
    row.fit,
    row.contact,
    row.role,
    row.email,
    row.emailStatus,
    row.phone,
    row.why,
    row.note,
  ]),
];
styleHeader(outreach.getRange("A1:N1"), "#B4C7E7");
outreach.getRange(`A2:N${rows.length + 1}`).format.wrapText = true;
outreach.freezePanes.freezeRows(1);
outreach.getRange("1:1").format.rowHeight = 28;
outreach.getRange(`2:${rows.length + 1}`).format.rowHeight = 42;

outreach.getRange("A:A").format.columnWidth = 10;
outreach.getRange("B:B").format.columnWidth = 32;
outreach.getRange("C:C").format.columnWidth = 22;
outreach.getRange("D:D").format.columnWidth = 16;
outreach.getRange("E:E").format.columnWidth = 8;
outreach.getRange("F:F").format.columnWidth = 14;
outreach.getRange("G:G").format.columnWidth = 16;
outreach.getRange("H:H").format.columnWidth = 24;
outreach.getRange("I:I").format.columnWidth = 24;
outreach.getRange("J:J").format.columnWidth = 32;
outreach.getRange("K:K").format.columnWidth = 14;
outreach.getRange("L:L").format.columnWidth = 16;
outreach.getRange("M:M").format.columnWidth = 42;
outreach.getRange("N:N").format.columnWidth = 40;

outreach.getRange(`A2:A${rows.length + 1}`).format.horizontalAlignment = "Center";
outreach.getRange(`E2:F${rows.length + 1}`).format.horizontalAlignment = "Center";
outreach.getRange(`K2:L${rows.length + 1}`).format.horizontalAlignment = "Center";

// Sources sheet
sources.getRange("A1:D1").values = [[
  "Organization",
  "Program / workshop source",
  "Contact source",
  "Source note",
]];
styleHeader(sources.getRange("A1:D1"), "#C6E0B4");

sources.getRange(`A2:D${rows.length + 1}`).values = rows.map((row) => [
  row.organization,
  row.programUrl,
  row.contactUrl,
  row.sourceNote,
]);
sources.getRange(`A2:D${rows.length + 1}`).format.wrapText = true;
sources.freezePanes.freezeRows(1);
sources.getRange("1:1").format.rowHeight = 26;
sources.getRange(`2:${rows.length + 1}`).format.rowHeight = 48;

sources.getRange("A:A").format.columnWidth = 30;
sources.getRange("B:C").format.columnWidth = 56;
sources.getRange("D:D").format.columnWidth = 52;

// Compact verification
const summaryCheck = await workbook.inspect({
  kind: "table",
  range: "Summary!A1:E14",
  include: "values,formulas",
  tableMaxRows: 14,
  tableMaxCols: 5,
});
console.log(summaryCheck.ndjson);

const outreachCheck = await workbook.inspect({
  kind: "table",
  range: "Outreach!A1:N8",
  include: "values,formulas",
  tableMaxRows: 8,
  tableMaxCols: 14,
});
console.log(outreachCheck.ndjson);

const errorScan = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errorScan.ndjson);

const summaryRender = await workbook.render({ sheetName: "Summary", range: "A1:M16", scale: 2 });
const outreachRender = await workbook.render({
  sheetName: "Outreach",
  range: `A1:N${rows.length + 1}`,
  scale: 1.25,
});
console.log(`Summary render bytes: ${summaryRender.size}`);
console.log(`Outreach render bytes: ${outreachRender.size}`);

await fs.mkdir(outputDir, { recursive: true });
const file = await SpreadsheetFile.exportXlsx(workbook);
await file.save(outputPath);

console.log(`Saved workbook to ${outputPath}`);

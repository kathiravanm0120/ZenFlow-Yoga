const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat, VerticalAlign,
  TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 360, after: 240 },
    children: [new TextRun({ text, bold: true, size: 28, font: "Times New Roman", color: "000000" })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 26, font: "Times New Roman", color: "000000" })]
  });
}

function body(text, align = AlignmentType.JUSTIFIED) {
  return new Paragraph({
    alignment: align,
    spacing: { line: 360, before: 0, after: 120 }, // 1.5 line spacing
    children: [new TextRun({ text, size: 28, font: "Times New Roman" })]
  });
}

function boldBody(text) {
  return new Paragraph({
    spacing: { line: 360, before: 0, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, font: "Times New Roman" })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { line: 360, before: 0, after: 80 },
    children: [new TextRun({ text, size: 28, font: "Times New Roman" })]
  });
}

function emptyLine() {
  return new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "" })] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function centeredBold(text, size = 28) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120 },
    children: [new TextRun({ text, bold: true, size, font: "Times New Roman" })]
  });
}

function centered(text, size = 28) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120 },
    children: [new TextRun({ text, size, font: "Times New Roman" })]
  });
}

function techTable() {
  const headerCell = (text) => new TableCell({
    borders,
    width: { size: 4000, type: WidthType.DXA },
    shading: { fill: "D9E1F2", type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 150, right: 150 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 26, font: "Times New Roman" })] })]
  });
  const dataCell = (text) => new TableCell({
    borders,
    width: { size: 5360, type: WidthType.DXA },
    margins: { top: 100, bottom: 100, left: 150, right: 150 },
    children: [new Paragraph({ children: [new TextRun({ text, size: 26, font: "Times New Roman" })] })]
  });

  const rows = [
    ["Framework", "Next.js (App Router)"],
    ["UI Library", "React"],
    ["Styling", "Tailwind CSS"],
    ["Language", "JavaScript / JSX"],
    ["Backend / Database", "Supabase (PostgreSQL)"],
    ["Version Control", "Git & GitHub"],
    ["Deployment", "Vercel"],
  ];

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4000, 5360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 4000, type: WidthType.DXA },
            shading: { fill: "2E5FA3", type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 150, right: 150 },
            children: [new Paragraph({ children: [new TextRun({ text: "Category", bold: true, size: 26, font: "Times New Roman", color: "FFFFFF" })] })]
          }),
          new TableCell({
            borders,
            width: { size: 5360, type: WidthType.DXA },
            shading: { fill: "2E5FA3", type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 150, right: 150 },
            children: [new Paragraph({ children: [new TextRun({ text: "Technology / Tool", bold: true, size: 26, font: "Times New Roman", color: "FFFFFF" })] })]
          }),
        ]
      }),
      ...rows.map(([cat, tech]) => new TableRow({
        children: [headerCell(cat), dataCell(tech)]
      }))
    ]
  });
}

function tocTable() {
  const row = (chap, title, page) => new TableRow({
    children: [
      new TableCell({
        borders: noBorders,
        width: { size: 1200, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: chap, size: 26, font: "Times New Roman" })] })]
      }),
      new TableCell({
        borders: noBorders,
        width: { size: 6960, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: title, size: 26, font: "Times New Roman" })] })]
      }),
      new TableCell({
        borders: noBorders,
        width: { size: 1200, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: page, size: 26, font: "Times New Roman" })] })]
      }),
    ]
  });

  const headerRow = (text) => new TableRow({
    children: [
      new TableCell({
        borders: noBorders,
        columnSpan: 3,
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill: "D9E1F2", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 26, font: "Times New Roman" })] })]
      })
    ]
  });

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 6960, 1200],
    rows: [
      new TableRow({
        children: [
          new TableCell({ borders: noBorders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "2E5FA3", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "CHAPTER NO.", bold: true, size: 24, font: "Times New Roman", color: "FFFFFF" })] })] }),
          new TableCell({ borders: noBorders, width: { size: 6960, type: WidthType.DXA }, shading: { fill: "2E5FA3", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "TITLE", bold: true, size: 24, font: "Times New Roman", color: "FFFFFF" })] })] }),
          new TableCell({ borders: noBorders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "2E5FA3", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 100, right: 100 }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "PAGE NO.", bold: true, size: 24, font: "Times New Roman", color: "FFFFFF" })] })] }),
        ]
      }),
      row("", "ABSTRACT", "I"),
      row("", "LIST OF FIGURES", "II"),
      row("", "LIST OF ABBREVIATIONS", "III"),
      row("1", "INTRODUCTION", "1"),
      row("1.1", "Background and Motivation", "1"),
      row("1.2", "Scope and Objectives", "2"),
      row("2", "SYSTEM METHODOLOGY", "3"),
      row("2.1", "System Architecture", "3"),
      row("2.2", "Development Process", "4"),
      row("2.3", "Module Description", "6"),
      row("3", "RESULTS AND DISCUSSIONS", "9"),
      row("4", "CONCLUSION AND FUTURE WORK", "12"),
      row("", "REFERENCES", "13"),
    ]
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 28 } }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Times New Roman", color: "000000" },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Times New Roman", color: "000000" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
      },
    ]
  },
  sections: [
    // ===== TITLE PAGE =====
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 }
        }
      },
      children: [
        emptyLine(), emptyLine(),
        centeredBold("A SUMMER INTERNSHIP REPORT", 28),
        centered("Submitted by", 26),
        emptyLine(),
        centeredBold("KATHIRAVAN M", 30),
        centered("Roll Number: XXXXXXXX", 26),
        centered("Department of Computer Science and Engineering", 26),
        emptyLine(),
        centered("in partial fulfillment for the Completion of", 26),
        centeredBold("Summer Internship 2026", 28),
        centered("In", 26),
        emptyLine(),
        centeredBold("PROJECT DEVELOPMENT CELL (PDC)", 30),
        centeredBold("COMPUTER SCIENCE AND ENGINEERING", 28),
        emptyLine(),
        centeredBold("COIMBATORE INSTITUTE OF TECHNOLOGY", 30),
        centered("(Government-Aided Autonomous Institution Affiliated to Anna University)", 24),
        centeredBold("COIMBATORE-641014", 26),
        emptyLine(),
        centeredBold("ANNA UNIVERSITY: CHENNAI 600 025", 26),
        emptyLine(),
        centered("June 2026", 28),
        pageBreak(),

        // ===== BONAFIDE CERTIFICATE =====
        emptyLine(),
        centeredBold("COIMBATORE INSTITUTE OF TECHNOLOGY", 28),
        centered("(A Govt. Aided Autonomous Institution Affiliated to Anna University)", 24),
        centeredBold("COIMBATORE – 641014", 26),
        emptyLine(),
        centeredBold("BONAFIDE CERTIFICATE", 30),
        emptyLine(),
        body('Certified that this summer internship\'2026 project "Development of a ZenFlow Yoga Portal Using Next.js, React & Tailwind CSS" is the bonafide work of Kathiravan M, Roll Number: XXXXXXXX, Department of Computer Science and Engineering, under the mentorship of the below-mentioned mentor during the period 25th May to 10th June 2026.'),
        emptyLine(),
        body("Certified that the candidate was examined continuously during the summer internship held at our premises through PDC."),
        emptyLine(), emptyLine(),
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [4513, 4513],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: noBorders,
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: "Dr. A. Kunthavai", bold: true, size: 26, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Convener – PDC", size: 26, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Department of CSE,", size: 26, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Coimbatore Institute of Technology,", size: 26, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Coimbatore – 641014", size: 26, font: "Times New Roman" })] }),
                  ]
                }),
                new TableCell({
                  borders: noBorders,
                  width: { size: 4513, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: "Mentor Signature", bold: true, size: 26, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Department of CSE,", size: 26, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Coimbatore Institute of Technology,", size: 26, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Coimbatore – 641014", size: 26, font: "Times New Roman" })] }),
                  ]
                }),
              ]
            })
          ]
        }),
        emptyLine(), emptyLine(),
        new Paragraph({ children: [new TextRun({ text: "Place: Coimbatore", size: 26, font: "Times New Roman" })] }),
        new Paragraph({ children: [new TextRun({ text: "Date: 10th June 2026", size: 26, font: "Times New Roman" })] }),
        pageBreak(),

        // ===== ABSTRACT =====
        centeredBold("ABSTRACT", 30),
        emptyLine(),
        body("The ZenFlow Yoga Portal is a fully functional, production-ready web application developed as part of the Summer Internship 2026 under the Project Development Cell (PDC), Coimbatore Institute of Technology. The application is built using Next.js (App Router), React, Tailwind CSS, and Supabase as the backend database service."),
        emptyLine(),
        body("The project aims to provide an elegant and accessible digital platform for yoga enthusiasts to explore various yoga practices, browse session schedules, and engage with a wellness-oriented community. It serves as a demonstration of modern frontend web development workflows combining component-driven architecture, utility-first styling, and seamless cloud deployment."),
        emptyLine(),
        body("The portal features a responsive landing page with an animated hero section, yoga classes displayed through reusable React card components, a weekly session schedule, a community voice section backed by Supabase for real-time suggestions, and an About section. The application has been deployed to Vercel with continuous integration and delivery enabled via GitHub."),
        emptyLine(),
        body("Key outcomes of this project include practical experience in the Next.js App Router paradigm, responsive design implementation using Tailwind CSS breakpoint utilities, Supabase integration for backend data management, and end-to-end deployment on Vercel. The challenges encountered, such as configuring App Router conventions and resolving build-time environment errors, provided significant learning value aligned with real-world software development practices."),
        pageBreak(),

        // ===== TABLE OF CONTENTS =====
        centeredBold("TABLE OF CONTENTS", 30),
        emptyLine(),
        tocTable(),
        pageBreak(),

        // ===== LIST OF FIGURES =====
        centeredBold("LIST OF FIGURES", 30),
        emptyLine(),
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [1440, 6146, 1440],
          rows: [
            new TableRow({
              children: [
                new TableCell({ borders: noBorders, width: { size: 1440, type: WidthType.DXA }, shading: { fill: "2E5FA3", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "FIGURE NO.", bold: true, size: 24, font: "Times New Roman", color: "FFFFFF" })] })] }),
                new TableCell({ borders: noBorders, width: { size: 6146, type: WidthType.DXA }, shading: { fill: "2E5FA3", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "TITLE", bold: true, size: 24, font: "Times New Roman", color: "FFFFFF" })] })] }),
                new TableCell({ borders: noBorders, width: { size: 1440, type: WidthType.DXA }, shading: { fill: "2E5FA3", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 100, right: 100 }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "PAGE NO.", bold: true, size: 24, font: "Times New Roman", color: "FFFFFF" })] })] }),
              ]
            }),
            ...([
              ["2.1", "System Architecture Diagram of ZenFlow Yoga Portal", "4"],
              ["2.2", "Next.js App Router Folder Structure", "5"],
              ["3.1", "ZenFlow Landing Page – Hero Section", "9"],
              ["3.2", "Explore Yoga Types Section", "10"],
              ["3.3", "Community Voice Section with Supabase Integration", "11"],
              ["3.4", "GitHub Repository Screenshot", "11"],
              ["3.5", "Supabase Table Editor – Polls Table", "12"],
            ]).map(([fig, title, page]) => new TableRow({
              children: [
                new TableCell({ borders: noBorders, width: { size: 1440, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: fig, size: 26, font: "Times New Roman" })] })] }),
                new TableCell({ borders: noBorders, width: { size: 6146, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: title, size: 26, font: "Times New Roman" })] })] }),
                new TableCell({ borders: noBorders, width: { size: 1440, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: page, size: 26, font: "Times New Roman" })] })] }),
              ]
            }))
          ]
        }),
        pageBreak(),

        // ===== LIST OF ABBREVIATIONS =====
        centeredBold("LIST OF ABBREVIATIONS", 30),
        emptyLine(),
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [2500, 6526],
          rows: [
            new TableRow({
              children: [
                new TableCell({ borders: noBorders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: "2E5FA3", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "ABBREVIATION", bold: true, size: 24, font: "Times New Roman", color: "FFFFFF" })] })] }),
                new TableCell({ borders: noBorders, width: { size: 6526, type: WidthType.DXA }, shading: { fill: "2E5FA3", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "FULL FORM", bold: true, size: 24, font: "Times New Roman", color: "FFFFFF" })] })] }),
              ]
            }),
            ...([
              ["HTML", "HyperText Markup Language"],
              ["CSS", "Cascading Style Sheets"],
              ["JSX", "JavaScript XML"],
              ["API", "Application Programming Interface"],
              ["CI/CD", "Continuous Integration / Continuous Deployment"],
              ["CTA", "Call to Action"],
              ["DXA", "Device-independent XML units of measure"],
              ["PDC", "Project Development Cell"],
              ["UI", "User Interface"],
              ["UX", "User Experience"],
              ["CSE", "Computer Science and Engineering"],
              ["CIT", "Coimbatore Institute of Technology"],
            ]).map(([abbr, full]) => new TableRow({
              children: [
                new TableCell({ borders: noBorders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: abbr, bold: true, size: 26, font: "Times New Roman" })] })] }),
                new TableCell({ borders: noBorders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: full, size: 26, font: "Times New Roman" })] })] }),
              ]
            }))
          ]
        }),
        pageBreak(),

        // ===== CHAPTER 1 =====
        centeredBold("CHAPTER 1", 30),
        centeredBold("INTRODUCTION", 30),
        emptyLine(),
        heading2("1.1 Background and Motivation"),
        body("The global wellness industry has witnessed exponential growth in recent years, with yoga emerging as one of the most widely practiced forms of physical and mental exercise. As digital platforms transform how people access health and wellness services, there is a growing demand for dedicated web portals that provide structured information, schedules, and community engagement tools for yoga practitioners."),
        emptyLine(),
        body("Modern web development frameworks such as Next.js, combined with component-based UI libraries like React and utility-first styling systems like Tailwind CSS, have revolutionized how scalable and performant web applications are built. These technologies allow developers to create visually appealing, responsive, and production-ready applications with significantly reduced development time and effort."),
        emptyLine(),
        body("This internship project leverages these cutting-edge technologies to build ZenFlow — a Yoga Portal that bridges the gap between traditional wellness practices and modern digital experiences. The project was developed during the Summer Internship 2026 under the Project Development Cell (PDC), Department of Computer Science and Engineering, Coimbatore Institute of Technology."),
        emptyLine(),
        heading2("1.2 Scope and Objectives"),
        body("The scope of the ZenFlow Yoga Portal encompasses the full lifecycle of a modern web application, from ideation and design through to development, testing, and cloud deployment. The application is intended for yoga enthusiasts, instructors, and wellness communities who seek a unified digital platform for class discovery and scheduling."),
        emptyLine(),
        boldBody("Objectives of the Project:"),
        bullet("To understand the fundamentals of Next.js and the React component model including the App Router paradigm."),
        bullet("To build a fully responsive, mobile-first web application using industry-standard tools."),
        bullet("To implement modern UI/UX design principles using Tailwind CSS utility classes."),
        bullet("To create reusable React components for yoga content and session cards."),
        bullet("To integrate Supabase as a backend database for dynamic content such as community suggestions."),
        bullet("To practice GitHub version control workflows including branching and commit management."),
        bullet("To gain practical experience deploying modern web applications on Vercel with CI/CD pipelines."),
        emptyLine(),
        boldBody("Applications:"),
        bullet("Yoga studios and wellness centres can use the portal to showcase classes and schedules."),
        bullet("Individual yoga practitioners can explore session types, timings, and booking options."),
        bullet("Community-driven class suggestions enable dynamic content management without manual updates."),
        bullet("The portal architecture serves as a reusable template for similar wellness or fitness domain applications."),
        pageBreak(),

        // ===== CHAPTER 2 =====
        centeredBold("CHAPTER 2", 30),
        centeredBold("SYSTEM METHODOLOGY", 30),
        emptyLine(),
        heading2("2.1 System Architecture"),
        body("The ZenFlow Yoga Portal follows a modern frontend-centric architecture with a cloud-based backend. The system is composed of four primary layers: the Presentation Layer (React/Next.js), the Styling Layer (Tailwind CSS), the Data Layer (Supabase), and the Deployment Layer (Vercel)."),
        emptyLine(),
        body("The Next.js App Router serves as the backbone of the application, managing page routing, layouts, and server-side rendering capabilities. React components encapsulate UI elements for reusability and maintainability. Supabase provides a managed PostgreSQL instance accessible via RESTful APIs for dynamic data such as community poll suggestions. Vercel hosts the application with automatic deployments triggered on every GitHub push to the main branch."),
        emptyLine(),
        boldBody("Technology Stack:"),
        emptyLine(),
        techTable(),
        emptyLine(),
        heading2("2.2 Development Process"),
        boldBody("Step 1: Project Initialization"),
        body("The project was bootstrapped using the official Next.js scaffolding command, which generated the complete project structure including the app directory, public assets folder, and all required configuration files such as next.config.ts, tailwind.config.js, and tsconfig.json."),
        emptyLine(),
        new Paragraph({
          spacing: { line: 280, before: 80, after: 120 },
          children: [new TextRun({ text: "npx create-next-app@latest zenflow-yoga", font: "Courier New", size: 22, color: "1F4E79" })]
        }),
        emptyLine(),
        boldBody("Step 2: Landing Page and Hero Section"),
        body("A visually immersive landing page was designed with a full-screen hero section featuring a yoga-themed background, an animated headline, and a prominent call-to-action (CTA) button. The design employs a dark color scheme with contrasting white and cyan typography to establish a premium wellness brand identity."),
        emptyLine(),
        boldBody("Step 3: Navigation and Layout"),
        body("A responsive navigation bar was built incorporating links to all key sections: Home, Yoga, Stats, Reviews, and Community Voice. On mobile viewports, the navigation collapses into a hamburger menu to maintain usability across screen sizes. The layout component wraps all pages, ensuring a consistent header and footer throughout the application."),
        emptyLine(),
        boldBody("Step 4: Yoga Classes Section"),
        body("A dedicated yoga exploration section was built using reusable React card components. Each card presents information about a specific yoga style, including its name, key benefits, and a brief description. The following yoga types are showcased in the portal:"),
        emptyLine(),
        bullet("Acro Yoga – Focuses on overall strength, stability, and mutual physical trust."),
        bullet("Vinyasa Yoga – Builds stamina, increases flow rate, and releases daily accumulated stress."),
        bullet("Hatha Yoga – Refines physical posture, structural alignment, and core stability."),
        bullet("Kundalini Yoga – Elevates spiritual awareness, cognitive focus, and active energy flows."),
        emptyLine(),
        boldBody("Step 5: Schedule and Booking Interface"),
        body("A session schedule component was developed to display weekly class timings in a structured, easy-to-read tabular format. The interface highlights upcoming classes and includes directional prompts to guide users toward booking or joining a session."),
        emptyLine(),
        boldBody("Step 6: Community Voice Section with Supabase"),
        body("The Community Voice feature enables users to suggest new class types or schedules. Submissions are stored in a Supabase PostgreSQL table named 'polls', with columns for id, question, and created_at. The frontend queries this table through the Supabase JavaScript client, displaying community suggestions in real-time. This integration provided hands-on experience with serverless backend services."),
        emptyLine(),
        boldBody("Step 7: Responsive Design with Tailwind CSS"),
        body("All pages and components were styled using Tailwind CSS utility classes. A consistent color palette of dark navy backgrounds, calming cyan accents, and white typography was maintained throughout. Responsive breakpoints (sm:, md:, lg:) were applied to all layout structures to ensure pixel-perfect rendering across mobile, tablet, and desktop devices."),
        emptyLine(),
        boldBody("Step 8: GitHub Version Control and Vercel Deployment"),
        body("The project was maintained under Git version control with regular commits to the main branch on GitHub (https://github.com/kathiravanm0120/ZenFlow-Yoga). Vercel was connected to the repository to enable automatic CI/CD deployments on every push, allowing continuous updates to the live production application."),
        emptyLine(),
        heading2("2.3 Module Description"),
        boldBody("Module 1: Home / Landing Page"),
        body("The Home module serves as the entry point of the application. It renders a full-width hero banner with the tagline 'Find Inner Peace Through Yoga', accompanied by a descriptive subtext and a 'Start Journey' CTA button. This module establishes the visual identity of the portal and guides users into exploring its offerings."),
        emptyLine(),
        boldBody("Module 2: Yoga Types Explorer"),
        body("This module presents an interactive grid of yoga styles, each encapsulated in a card component. The card component accepts props for yoga name, icon, and description, making it fully reusable and extensible for adding new yoga types in the future without modifying the underlying layout structure."),
        emptyLine(),
        boldBody("Module 3: Stats and Reviews"),
        body("The Stats module showcases quantitative metrics about the platform such as the number of active members, classes offered, and expert instructors available. The Reviews module displays testimonials from practitioners, providing social proof and building user trust. Both modules are implemented as static React components styled with Tailwind utility classes."),
        emptyLine(),
        boldBody("Module 4: Community Voice"),
        body("The Community Voice module is the most technically significant component, integrating Supabase as a live backend. Users can submit suggestions for new classes or schedules through an input field. Submissions are written to the Supabase polls table via the Supabase JS client. The module also reads and displays existing community suggestions, enabling a participatory content model."),
        emptyLine(),
        boldBody("Module 5: Navigation and Footer"),
        body("The navigation component renders the site logo, links, and a 'Join Now' button. It uses React state to manage the mobile hamburger menu toggle. The footer displays copyright information. Both components are defined in the shared layout and rendered consistently across all pages."),
        pageBreak(),

        // ===== CHAPTER 3 =====
        centeredBold("CHAPTER 3", 30),
        centeredBold("RESULTS AND DISCUSSIONS", 30),
        emptyLine(),
        heading2("3.1 Implemented Features"),
        body("The ZenFlow Yoga Portal was successfully developed and deployed with all planned features fully functional. The following outcomes were achieved at the conclusion of the internship period:"),
        emptyLine(),
        bullet("Responsive landing page with animated hero section and call-to-action button."),
        bullet("Navigation bar with mobile hamburger menu supporting all screen breakpoints."),
        bullet("Yoga types explorer section displaying four yoga styles with reusable card components."),
        bullet("Weekly session schedule display formatted for clarity and readability."),
        bullet("About section highlighting the portal's mission and wellness philosophy."),
        bullet("Community Voice feature with live Supabase backend integration for user suggestions."),
        bullet("Tailwind CSS responsive design applied across all breakpoints (sm, md, lg)."),
        bullet("GitHub repository with complete commit history at https://github.com/kathiravanm0120/ZenFlow-Yoga."),
        bullet("Vercel cloud deployment with automatic CI/CD pipeline on every GitHub push."),
        emptyLine(),
        heading2("3.2 Application Screenshots"),
        body("Figure 3.1 shows the ZenFlow landing page hero section with the tagline 'Find Inner Peace Through Yoga'. The dark theme with cyan accent colors establishes a premium wellness brand identity. The 'Start Journey' CTA button is prominently placed to guide new users."),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 60 },
          children: [new TextRun({ text: "[Figure 3.1: ZenFlow Landing Page – Hero Section]", italics: true, size: 24, font: "Times New Roman", color: "595959" })]
        }),
        emptyLine(),
        body("Figure 3.2 illustrates the Yoga Types Explorer section displaying cards for Acro Yoga, Vinyasa Yoga, Hatha Yoga, and Kundalini Yoga. Each card is a self-contained React component that renders the yoga type name, an illustrative icon, and a brief description of its benefits."),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 60 },
          children: [new TextRun({ text: "[Figure 3.2: Explore Yoga Types Section]", italics: true, size: 24, font: "Times New Roman", color: "595959" })]
        }),
        emptyLine(),
        body("Figure 3.3 displays the Community Voice section powered by Supabase. Users can submit class type suggestions through the text input. The message 'No community requests yet. Be the first to suggest one!' confirms that the database connection is active and the table is being queried successfully."),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 60 },
          children: [new TextRun({ text: "[Figure 3.3: Community Voice Section with Supabase Integration]", italics: true, size: 24, font: "Times New Roman", color: "595959" })]
        }),
        emptyLine(),
        body("Figure 3.4 shows the GitHub repository for the project under the username kathiravanm0120. The repository structure includes the app directory, public assets, configuration files (next.config.ts, tailwind.config.js, tsconfig.json), and two active Vercel deployments linked to the production environment."),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 60 },
          children: [new TextRun({ text: "[Figure 3.4: GitHub Repository – github.com/kathiravanm0120/ZenFlow-Yoga]", italics: true, size: 24, font: "Times New Roman", color: "595959" })]
        }),
        emptyLine(),
        body("Figure 3.5 displays the Supabase Table Editor showing the polls table with columns id (int8), question (text), and created_at (timestamp). The RLS (Row Level Security) is currently disabled for development purposes, and the table is accessible through the Supabase REST API from the Next.js frontend."),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 60 },
          children: [new TextRun({ text: "[Figure 3.5: Supabase Table Editor – Polls Table]", italics: true, size: 24, font: "Times New Roman", color: "595959" })]
        }),
        emptyLine(),
        heading2("3.3 Challenges Faced and Resolutions"),
        body("Several technical challenges were encountered during the development process. Each challenge provided a meaningful learning opportunity and was resolved through systematic debugging and documentation review."),
        emptyLine(),
        boldBody("Challenge 1: Next.js App Router Structure"),
        body("Configuring the Next.js App Router for the first time required understanding the new layout.js and page.js file conventions, which differ significantly from the legacy Pages Router. Nested layouts and shared components required careful placement within the app directory hierarchy. This was resolved by thoroughly studying the official Next.js App Router documentation and applying the concepts iteratively."),
        emptyLine(),
        boldBody("Challenge 2: Responsive Layout Consistency"),
        body("Achieving pixel-perfect responsive layouts across mobile, tablet, and desktop viewports required disciplined use of Tailwind CSS's responsive prefix classes (sm:, md:, lg:). Certain components such as the card grid and navigation required multiple iterations to render correctly across all breakpoints. This was addressed by applying a mobile-first design approach and progressively enhancing layouts for larger screens."),
        emptyLine(),
        boldBody("Challenge 3: Vercel Deployment Build Errors"),
        body("The initial Vercel deployment encountered build-time errors due to missing environment variable configurations for the Supabase URL and API key. These were resolved by adding the required environment variables in the Vercel project dashboard under the Environment Variables section and re-triggering the deployment workflow."),
        emptyLine(),
        boldBody("Challenge 4: Supabase RLS Policy Configuration"),
        body("Enabling Row Level Security (RLS) on the Supabase polls table initially blocked all read and write operations from the frontend. This was temporarily resolved by disabling RLS during development and documenting the requirement to configure appropriate policies before production hardening."),
        pageBreak(),

        // ===== CHAPTER 4 =====
        centeredBold("CHAPTER 4", 30),
        centeredBold("CONCLUSION AND FUTURE WORK", 30),
        emptyLine(),
        heading2("4.1 Conclusion"),
        body("The ZenFlow Yoga Portal project successfully demonstrates the development of a modern, production-ready web application using Next.js, React, Tailwind CSS, and Supabase. The project was completed within the six-day internship window (25th May to 10th June 2026) under the Project Development Cell, Coimbatore Institute of Technology."),
        emptyLine(),
        body("By combining a well-structured component architecture, responsive UI design, Supabase backend integration, GitHub version control, and Vercel deployment, the application provides a comprehensive example of contemporary frontend web development practices. The portal successfully delivers on all its stated objectives and features a polished, functional user interface appropriate for real-world deployment."),
        emptyLine(),
        body("The challenges encountered during development — including App Router configuration, responsive layout management, and deployment environment setup — provided invaluable hands-on problem-solving experience directly applicable to industry roles in frontend and full-stack web development."),
        emptyLine(),
        heading2("4.2 Future Work"),
        body("While the current version of ZenFlow is functionally complete, several enhancements are planned for future development iterations:"),
        emptyLine(),
        bullet("User Authentication: Implementing Supabase Auth to enable user registration, login, and personalized session booking with role-based access control."),
        bullet("Class Booking System: Adding a booking module that allows users to reserve spots in specific yoga sessions with real-time availability tracking."),
        bullet("Instructor Profiles: Creating detailed profile pages for yoga instructors, including qualifications, specializations, and user ratings."),
        bullet("Payment Integration: Integrating Stripe or Razorpay for subscription plans and individual class payment processing."),
        bullet("Progressive Web App (PWA): Converting the portal into a PWA to support offline access, push notifications, and mobile home screen installation."),
        bullet("Analytics Dashboard: Implementing an admin dashboard with charts and metrics for tracking user engagement, class popularity, and booking trends."),
        bullet("Multilingual Support: Adding internationalization (i18n) support for Tamil and other regional languages to reach a broader user base."),
        pageBreak(),

        // ===== REFERENCES =====
        centeredBold("REFERENCES", 30),
        emptyLine(),
        new Paragraph({
          spacing: { line: 360, before: 0, after: 120 },
          children: [new TextRun({ text: "1. Vercel Inc. (2024) 'Next.js Documentation – App Router', Available at: https://nextjs.org/docs [Accessed: June 2026].", size: 26, font: "Times New Roman" })]
        }),
        new Paragraph({
          spacing: { line: 360, before: 0, after: 120 },
          children: [new TextRun({ text: "2. Tailwind Labs Inc. (2024) 'Tailwind CSS Documentation', Available at: https://tailwindcss.com/docs [Accessed: June 2026].", size: 26, font: "Times New Roman" })]
        }),
        new Paragraph({
          spacing: { line: 360, before: 0, after: 120 },
          children: [new TextRun({ text: "3. Supabase Inc. (2024) 'Supabase Documentation – JavaScript Client Library', Available at: https://supabase.com/docs [Accessed: June 2026].", size: 26, font: "Times New Roman" })]
        }),
        new Paragraph({
          spacing: { line: 360, before: 0, after: 120 },
          children: [new TextRun({ text: "4. Meta Open Source. (2024) 'React Documentation – Component Model', Available at: https://react.dev [Accessed: June 2026].", size: 26, font: "Times New Roman" })]
        }),
        new Paragraph({
          spacing: { line: 360, before: 0, after: 120 },
          children: [new TextRun({ text: "5. Vercel Inc. (2024) 'Vercel Deployment Documentation', Available at: https://vercel.com/docs [Accessed: June 2026].", size: 26, font: "Times New Roman" })]
        }),
        new Paragraph({
          spacing: { line: 360, before: 0, after: 120 },
          children: [new TextRun({ text: "6. GitHub Inc. (2024) 'GitHub Actions and CI/CD Workflows', Available at: https://docs.github.com [Accessed: June 2026].", size: 26, font: "Times New Roman" })]
        }),
        new Paragraph({
          spacing: { line: 360, before: 0, after: 120 },
          children: [new TextRun({ text: "7. Kathiravan M. (2026) 'ZenFlow Yoga Portal – Source Code Repository', Available at: https://github.com/kathiravanm0120/ZenFlow-Yoga [Accessed: June 2026].", size: 26, font: "Times New Roman" })]
        }),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/claude/ZenFlow_Internship_Report.docx', buffer);
  console.log('Report created successfully!');
});
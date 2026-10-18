/**
 * Mock Data for Ofek Health - Claims Processing & Intelligent Pre-Validation System
 * Realistic mock dataset representing policies, customers, claims, handlers, and audit logs.
 */

const MOCK_DATA = {
  // Current logged in demo users
  users: {
    customer: {
      id: "CUST-9021",
      name: "ישראל ישראלי",
      idNumber: "028475913",
      email: "israel.i@example.com",
      phone: "050-1234567",
      policyNumber: "POL-773291-IL",
      policyType: "אופק פרימיום מורחב",
      startDate: "2021-01-01",
      status: "פעילה",
      waitingPeriods: {
        surgery: { completed: true, monthsRequired: 6, endDate: "2021-07-01" },
        imaging: { completed: true, monthsRequired: 3, endDate: "2021-04-01" },
        consultation: { completed: true, monthsRequired: 3, endDate: "2021-04-01" },
        medication: { completed: true, monthsRequired: 6, endDate: "2021-07-01" },
        dental: { completed: false, monthsRequired: 12, monthsElapsed: 4, endDate: "2027-06-01" },
        pregnancy: { completed: false, monthsRequired: 12, monthsElapsed: 7, endDate: "2027-01-01" }
      },
      coverages: {
        surgery: { covered: true, startDate: "2021-01-01", status: "active", name: "ניתוחים ואשפוז בארץ" },
        imaging: { covered: true, startDate: "2021-01-01", status: "active", name: "דימות מתקדם (MRI/CT)" },
        consultation: { covered: true, startDate: "2021-01-01", status: "active", name: "ייעוץ מומחים" },
        medication: { covered: true, startDate: "2021-01-01", status: "active", name: "תרופות מחוץ לסל" },
        dental: { covered: true, startDate: "2026-06-01", status: "active", name: "טיפולי שיניים מורכבים" },
        alternative: { covered: false, reason: "אינו כלול בפוליסת אופק פרימיום מורחב", name: "רפואה משלימה" },
        critical_care: { covered: true, startDate: "2021-01-01", cancelDate: "2026-05-01", status: "cancelled", name: "טיפול נמרץ מיוחד" }
      }
    },
    handler: {
      id: "HND-04",
      name: "רונית לוי",
      role: "רפרנטית תביעות בכירה",
      department: "מחלקת תביעות בריאות",
      activeClaimsCount: 14,
      targetDailyQuota: 25
    },
    manager: {
      id: "MGR-01",
      name: "דן כרמלי",
      role: "מנהל מחלקת תביעות",
      department: "אופק בריאות - הנהלת תביעות"
    },
    executive: {
      id: "EXEC-02",
      name: "מיכל ברקוביץ'",
      role: "סמנכ\"לית תפעול ושירות",
      department: "הנהלה ראשית"
    }
  },

  // 18 Claims Handlers Team
  handlers: [
    { id: "HND-01", name: "אלון מזרחי", activeClaims: 16, pendingReview: 4, avgHandleTimeMin: 11.2, specializations: ["ניתוחים", "אשפוז"], status: "online" },
    { id: "HND-02", name: "מאיה אברהם", activeClaims: 12, pendingReview: 2, avgHandleTimeMin: 9.8, specializations: ["דימות ו-MRI", "רופאים מומחים"], status: "online" },
    { id: "HND-03", name: "יוסי שפירא", activeClaims: 19, pendingReview: 7, avgHandleTimeMin: 14.5, specializations: ["תביעות חו\"ל", "ניתוחים"], status: "busy" },
    { id: "HND-04", name: "רונית לוי", activeClaims: 14, pendingReview: 3, avgHandleTimeMin: 10.1, specializations: ["ניתוחים", "רפואה מותאמת"], status: "online" },
    { id: "HND-05", name: "דניאל גרינברג", activeClaims: 8, pendingReview: 1, avgHandleTimeMin: 8.5, specializations: ["שיניים", "אמבולטורי"], status: "online" },
    { id: "HND-06", name: "תמר בן-ארי", activeClaims: 15, pendingReview: 5, avgHandleTimeMin: 12.0, specializations: ["דימות", "חוות דעת שניה"], status: "online" },
    { id: "HND-07", name: "עומר קסטן", activeClaims: 18, pendingReview: 6, avgHandleTimeMin: 13.4, specializations: ["ניתוחים מורכבים"], status: "busy" },
    { id: "HND-08", name: "שירה אזולאי", activeClaims: 11, pendingReview: 2, avgHandleTimeMin: 9.2, specializations: ["תרופות מחוץ לסל"], status: "online" },
    { id: "HND-09", name: "ליאור חסון", activeClaims: 21, pendingReview: 8, avgHandleTimeMin: 15.1, specializations: ["אשפוז וסיעוד"], status: "busy" },
    { id: "HND-10", name: "נועה כהן", activeClaims: 13, pendingReview: 3, avgHandleTimeMin: 10.4, specializations: ["רופאים מומחים"], status: "online" },
    { id: "HND-11", name: "איתי פרץ", activeClaims: 9, pendingReview: 1, avgHandleTimeMin: 8.9, specializations: ["דימות ורנטגן"], status: "online" },
    { id: "HND-12", name: "מיטל דיין", activeClaims: 14, pendingReview: 4, avgHandleTimeMin: 11.5, specializations: ["שיניים"], status: "away" },
    { id: "HND-13", name: "גל כץ", activeClaims: 17, pendingReview: 5, avgHandleTimeMin: 12.8, specializations: ["ניתוחים"], status: "online" },
    { id: "HND-14", name: "רותם סלע", activeClaims: 10, pendingReview: 2, avgHandleTimeMin: 9.6, specializations: ["אמבולטורי"], status: "online" },
    { id: "HND-15", name: "אביב גבאי", activeClaims: 13, pendingReview: 3, avgHandleTimeMin: 10.7, specializations: ["רופאים מומחים"], status: "online" },
    { id: "HND-16", name: "הדר מור", activeClaims: 15, pendingReview: 4, avgHandleTimeMin: 11.9, specializations: ["תרופות"], status: "online" },
    { id: "HND-17", name: "אסף וייס", activeClaims: 7, pendingReview: 1, avgHandleTimeMin: 8.2, specializations: ["דימות"], status: "online" },
    { id: "HND-18", name: "קארן שטרן", activeClaims: 16, pendingReview: 6, avgHandleTimeMin: 13.1, specializations: ["ניתוחים מורכבים"], status: "busy" }
  ],

  // Claim Types Catalog with Required Documents
  claimCategories: [
    {
      id: "surgery",
      name: "ניתוח ואשפוז בארץ",
      icon: "fa-hospital-user",
      description: "כיסוי עלויות ניתוח פרטי, אשפוז, מנתח ומרדים",
      requiredDocs: [
        { 
          id: "invoice", 
          name: "חשבונית מס / קבלה מקורית", 
          mandatory: true, 
          detail: "חשבונית מס קבלה מקורית הכוללת: שם המטופל/ת, תאריך הטיפול, פירוט סעיפי התשלום (שכר מנתח, מרדים, חדר ניתוח), סכום מלא ששולם, חותמת 'שולם' ומספר ח.פ./עוסק מורשה של המוסד הרפואי." 
        },
        { 
          id: "discharge", 
          name: "סיכום מחלה / שחרור מאשפוז", 
          mandatory: true, 
          detail: "מכתב שחרור רשמי הכולל: תאריכי קבלה ושחרור מאשפוז, אבחנה רפואית מלאה (Diagnosis), מהלך הטיפול, הנחיות להמשך טיפול רפואי וחתימת המחלקה הרפואית." 
        },
        { 
          id: "op_report", 
          name: "דו\"ח ניתוח חתום ע\"י המנתח", 
          mandatory: true, 
          detail: "דו\"ח ניתוח רשמי ומלא הכולל: תאריך הפרוצדורה, סוג ההרדמה, שמות המנתח והמרדים, פירוט מהלך הניתוח והממצאים, וחתימה מלאה של הרופא המנתח כולל מספר רישיון משרד הבריאות." 
        },
        { 
          id: "pre_auth", 
          name: "טופס התחייבות / אישור מוקדם (אם קיים)", 
          mandatory: false, 
          detail: "טופס אישור עקרוני, מכתב התחייבות או מספר אישור מוקדם שהונפק על ידי חברת הביטוח טרם ביצוע הניתוח (מסמך רשות)." 
        }
      ]
    },
    {
      id: "imaging",
      name: "בדיקות דימות מתקדמות (MRI, CT, PET)",
      icon: "fa-x-ray",
      description: "בדיקות דימות במכונים ומכשור מתקדם",
      requiredDocs: [
        { 
          id: "invoice", 
          name: "קבלה / חשבונית תשלום", 
          mandatory: true, 
          detail: "חשבונית מס קבלה מקורית הכוללת: שם הנבדק/ת, תאריך ביצוע הבדיקה, סוג בדיקת הדימות המדויק, סכום ששולם בפועל ופרטי המכון המבצע." 
        },
        { 
          id: "referral", 
          name: "הפניית רופא מומחה לבדיקה", 
          mandatory: true, 
          detail: "הפניה רפואית עדכנית הכוללת: פרטי הרופא המפנה ומספר רישיון, תאריך ההפניה, פירוט התלונות והרקע הרפואי, והנמקה מקצועית לצורך בביצוע בדיקת הדימות." 
        },
        { 
          id: "imaging_result", 
          name: "פענוח הבדיקה / תוצאות רשמיות", 
          mandatory: true, 
          detail: "דו\"ח פענוח תוצאות מלא ורשמי הכולל: תאריך הבדיקה, האזור/האיבר שנבדק, פירוט הממצאים והאבחנה הרדיולוגית, חתום ע\"י רופא רדיולוג מומחה." 
        }
      ]
    },
    {
      id: "consultation",
      name: "ייעוץ רופא מומחה (חוות דעת שנייה)",
      icon: "fa-user-md",
      description: "החזר עבור פגישות ייעוץ פרטיות עם מומחים מוכרים",
      requiredDocs: [
        { 
          id: "invoice", 
          name: "חשבונית מס / קבלה מרופא מומחה", 
          mandatory: true, 
          detail: "חשבונית מס קבלה מקורית הכוללת: שם המבוטח/ת, תאריך הפגישה, שם הרופא המומחה, תחום ההתמחות, מספר רישיון משרד הבריאות (מ.ר.), סכום שכר הטרחה ששולם וחותמת 'שולם'." 
        },
        { 
          id: "summary_letter", 
          name: "מכתב סיכום ייעוץ והמלצות", 
          mandatory: true, 
          detail: "מכתב סיכום פגישה מפורט הכולל: סיבת הפנייה והתלונות, ממצאי הבדיקה הקלינית, אבחנה רפואית והמלצות להמשך בירור או טיפול, חתום בחותמת וחתימת המומחה." 
        }
      ]
    },
    {
      id: "dental",
      name: "טיפולי שיניים מורכבים",
      icon: "fa-tooth",
      description: "טיפולים משמרים, שיקום הפה ויישור שיניים",
      requiredDocs: [
        { 
          id: "invoice", 
          name: "חשבונית מס / קבלות תשלום", 
          mandatory: true, 
          detail: "חשבונית מס או קבלות תשלום מקוריות הכוללות: שם המטופל/ת, תאריכי ביצוע הטיפולים, פירוט הסכומים ששולמו עבור כל שלב ופרטי מרפאת השיניים." 
        },
        { 
          id: "treatment_plan", 
          name: "תוכנית טיפול חתומה + צילומי רנטגן", 
          mandatory: true, 
          detail: "תוכנית טיפול דנטלית מפורטת הכוללת: מספרי השיניים שטופלו, פירוט הפרוצדורות (שתלים/כתרים/עקירות), חתימת רופא השיניים ומספר רישיון (מ.ר.ש.), בצירוף צילומי רנטגן (לפני ואחרי הטיפול)." 
        }
      ]
    },
    {
      id: "medication",
      name: "תרופות מחוץ לסל הבריאות",
      icon: "fa-pills",
      description: "תרופות אונקולוגיות ותרופות מצילות חיים",
      requiredDocs: [
        { 
          id: "invoice", 
          name: "חשבונית קנייה מבית מרקחת", 
          mandatory: true, 
          detail: "חשבונית מס קבלה מקורית מבית המרקחת הכוללת: תאריך הרכישה, שם התרופה המדויק, מינון, כמות יחידות/אריזות שנרכשו והסכום ששולם בפועל." 
        },
        { 
          id: "prescription", 
          name: "מרשם רופא מומחה + אישור 29ג", 
          mandatory: true, 
          detail: "מרשם רפואי עדכני מרופא מומחה בתחום המחלה הכולל אבחנה ומינון, בצירוף טופס אישור משרד הבריאות לייבוא/ניפוק תרופה שאינה רשומה (טופס 29ג חתום ומאושר)." 
        }
      ]
    },
    {
      id: "alternative",
      name: "רפואה משלימה וטיפולים אלטרנטיביים",
      icon: "fa-spa",
      description: "טיפולי דיקור, כירופרקטיקה והומאופתיה (אינו כלול בפוליסת אופק פרימיום מורחב)",
      requiredDocs: [
        { 
          id: "invoice", 
          name: "חשבונית מס / קבלה ממרפאת הטיפול", 
          mandatory: true, 
          detail: "חשבונית מס קבלה מקורית הכוללת פירוט סוג הטיפול האלטרנטיבי, תאריך ושם המטפל." 
        },
        { 
          id: "referral", 
          name: "המלצת רופא מטפל / תוכנית טיפול", 
          mandatory: true, 
          detail: "מכתב הפניה רפואי הממליץ על טיפול משלים." 
        }
      ]
    }
  ],

  // Comprehensive Israeli Medical Centers Directory (Alphabetically Sorted & Categorized)
  medicalProviders: [
    {
      id: "PROV-001",
      name: "אסותא רמת החייל - תל אביב",
      city: "תל אביב",
      license: "רישוי מוסד מס' 449",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' אהוד רז", license: "מ.ר. 18294", specialty: "כירורגיה כללית ולפרוסקופיה" },
        { name: "פרופ' דן גריסרו", license: "מ.ר. 22410", specialty: "גינקולוגיה ואונקולוגיה" },
        { name: "ד\"ר גלעד נוי", license: "מ.ר. 33910", specialty: "אורתופדיה ופגיעות ספורט" },
        { name: "פרופ' איתן מור", license: "מ.ר. 11029", specialty: "כירורגיה מורכבת והשתלות" },
        { name: "ד\"ר ירון ברקוביץ'", license: "מ.ר. 44182", specialty: "רדיולוגיה פולשנית ודימות" }
      ]
    },
    {
      id: "PROV-002",
      name: "אסותא ראשון לציון",
      city: "ראשון לציון",
      license: "רישוי מוסד מס' 450",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "ד\"ר שמעון לוי", license: "מ.ר. 55102", specialty: "כירורגיה לפרוסקופית" },
        { name: "ד\"ר מיכל שניידר", license: "מ.ר. 66291", specialty: "אורתופדיה של כף היד" },
        { name: "פרופ' רונן בכר", license: "מ.ר. 77182", specialty: "אף אוזן גרון וניתוחי ראש צוואר" }
      ]
    },
    {
      id: "PROV-003",
      name: "אסותא חיפה (לב המפרץ)",
      city: "חיפה",
      license: "רישוי מוסד מס' 451",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' עמוס נאמן", license: "מ.ר. 88129", specialty: "אורולוגיה וכירורגיה זעיר פולשנית" },
        { name: "ד\"ר עמית רפאלי", license: "מ.ר. 99201", specialty: "כירורגיה פלסטית ומשחזרת" }
      ]
    },
    {
      id: "PROV-004",
      name: "בית חולים אלישע (חיפה)",
      city: "חיפה",
      license: "רישוי מוסד מס' 701",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' אברהם שניפר", license: "מ.ר. 11928", specialty: "אורתופדיה וכירורגיית עמוד שדרה" },
        { name: "ד\"ר חאלד חורי", license: "מ.ר. 44910", specialty: "כירורגיה כללית" },
        { name: "ד\"ר לימור אדלר", license: "מ.ר. 88391", specialty: "דימות נשים וממוגרפיה" }
      ]
    },
    {
      id: "PROV-005",
      name: "בית חולים הדסה עין כרם",
      city: "ירושלים",
      license: "רישוי מוסד מס' 003",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' אלון פיקרסקי", license: "מ.ר. 13920", specialty: "כירורגיה קולורקטלית ומעי" },
        { name: "פרופ' יגאל שושן", license: "מ.ר. 14022", specialty: "נוירוכירורגיה וגידולי מוח" },
        { name: "פרופ' איריס ברק", license: "מ.ר. 29401", specialty: "קרדיולוגיה וצנתורים" },
        { name: "ד\"ר עודד שמעוני", license: "מ.ר. 38491", specialty: "נוירורדיולוגיה ו-MRI" }
      ]
    },
    {
      id: "PROV-006",
      name: "בית חולים הרצליה מדיקל סנטר (HMC)",
      city: "הרצליה פיתוח",
      license: "רישוי מוסד מס' 102",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' שלמה משיח", license: "מ.ר. 12903", specialty: "פריון וגינקולוגיה" },
        { name: "ד\"ר ערן ממן", license: "מ.ר. 44391", specialty: "אורתופדיה וניתוחי כתף" },
        { name: "פרופ' יוסף קלאוזנר", license: "מ.ר. 10023", specialty: "כירורגיה אונקולוגית" },
        { name: "ד\"ר גיל סיגל", license: "מ.ר. 55092", specialty: "אורולוגיה" }
      ]
    },
    {
      id: "PROV-007",
      name: "בית חולים לניאדו",
      city: "נתניה",
      license: "רישוי מוסד מס' 009",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' צבי שמעוני", license: "מ.ר. 33921", specialty: "רפואה פנימית ומחלות זיהומיות" },
        { name: "ד\"ר אלכסנדר לויט", license: "מ.ר. 44102", specialty: "כירורגיה כללית" },
        { name: "ד\"ר אילן בר", license: "מ.ר. 55829", specialty: "גינקולוגיה ומיילדות" }
      ]
    },
    {
      id: "PROV-008",
      name: "בית חולים רפאל - עתידים",
      city: "תל אביב",
      license: "רישוי מוסד מס' 882",
      categories: ["surgery", "consultation", "imaging"],
      doctors: [
        { name: "פרופ' משה פפא", license: "מ.ר. 22019", specialty: "כירורגיה כללית ושד" },
        { name: "ד\"ר בנימין בנדר", license: "מ.ר. 33410", specialty: "אורתופדיה והחלפת מפרקים" },
        { name: "ד\"ר אבירם שמעון", license: "מ.ר. 77621", specialty: "רדיולוגיה ודימות" }
      ]
    },
    {
      id: "PROV-009",
      name: "בית מרקחת מדי-פארם (תרופות מיוחדות)",
      city: "רמת גן",
      license: "מ.ר.פ. 109",
      categories: ["medication"],
      doctors: [
        { name: "פרופ' אליעזר זק", license: "מ.ר. 99301", specialty: "אונקולוגיה ואימונותרפיה" },
        { name: "פרופ' משה ענבר", license: "מ.ר. 10294", specialty: "אונקולוגיה קלינית" }
      ]
    },
    {
      id: "PROV-010",
      name: "בית מרקחת מרכז הכרמל",
      city: "חיפה",
      license: "מ.ר.פ. 441",
      categories: ["medication"],
      doctors: [
        { name: "פרופ' ברוך ברנר", license: "מ.ר. 12948", specialty: "המטולוגיה וקרישת דם" },
        { name: "ד\"ר שרה גולדברג", license: "מ.ר. 88291", specialty: "אונקולוגיה" }
      ]
    },
    {
      id: "PROV-011",
      name: "בית מרקחת שור טבצ'ניק (29ג וייבוא אישי)",
      city: "תל אביב",
      license: "מ.ר.פ. 022",
      categories: ["medication"],
      doctors: [
        { name: "פרופ' אליעזר זק", license: "מ.ר. 99301", specialty: "אונקולוגיה ואימונותרפיה" },
        { name: "ד\"ר הדס קסטן", license: "מ.ר. 66102", specialty: "המטולוגיה" }
      ]
    },
    {
      id: "PROV-012",
      name: "דנטל קייר (Dental Care) מרכז מומחים",
      city: "פתח תקווה",
      license: "מ.ר.ש. 882",
      categories: ["dental"],
      doctors: [
        { name: "ד\"ר שאול רובינשטיין", license: "מ.ר.ש. 33921", specialty: "שיקום הפה והשתלות" },
        { name: "ד\"ר מירב ברקת", license: "מ.ר.ש. 44019", specialty: "אורתודונטיה ויישור שיניים" },
        { name: "ד\"ר אריאל לוי", license: "מ.ר.ש. 55912", specialty: "טיפולי שורש מתקדמים (אנדודונטיה)" }
      ]
    },
    {
      id: "PROV-013",
      name: "המרכז להשתלות שיניים - ד\"ר בלן",
      city: "תל אביב",
      license: "מ.ר.ש. 550",
      categories: ["dental"],
      doctors: [
        { name: "ד\"ר יגאל בלן", license: "מ.ר.ש. 11928", specialty: "השתלות שיניים מורכבות והעמסה מיידית" },
        { name: "ד\"ר דורון נווה", license: "מ.ר.ש. 22941", specialty: "כירורגיית פה ולסת" }
      ]
    },
    {
      id: "PROV-014",
      name: "המרכז הרפואי ברזילי",
      city: "אשקלון",
      license: "רישוי מוסד מס' 008",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' חזי לוי", license: "מ.ר. 10044", specialty: "כירורגיה כללית ומינהל" },
        { name: "פרופ' בוריס יופה", license: "מ.ר. 22491", specialty: "כירורגיה לפרוסקופית" },
        { name: "ד\"ר רונן גלילי", license: "מ.ר. 33829", specialty: "כירורגיית כלי דם" }
      ]
    },
    {
      id: "PROV-015",
      name: "המרכז הרפואי וולפסון",
      city: "חולון",
      license: "רישוי מוסד מס' 007",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' אריה לוין", license: "מ.ר. 11029", specialty: "גסטרואנטרולוגיה ותזונה" },
        { name: "ד\"ר חגי אמיר", license: "מ.ר. 22940", specialty: "אורתופדיה ושיקום" },
        { name: "ד\"ר אלי הרשקוביץ", license: "מ.ר. 33819", specialty: "רדיולוגיה ודימות CT" }
      ]
    },
    {
      id: "PROV-016",
      name: "המרכז הרפואי כרמל",
      city: "חיפה",
      license: "רישוי מוסד מס' 012",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' עופר לביא", license: "מ.ר. 19204", specialty: "גינקולוגיה ואונקולוגיה נשית" },
        { name: "ד\"ר בני חן", license: "מ.ר. 28491", specialty: "אורתופדיה של הברך והקרסול" },
        { name: "ד\"ר נטליה גולדברג", license: "מ.ר. 39401", specialty: "דימות פולשני" }
      ]
    },
    {
      id: "PROV-017",
      name: "המרכז הרפואי לגליל",
      city: "נהריה",
      license: "רישוי מוסד מס' 015",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' מסעד ברהום", license: "מ.ר. 10082", specialty: "רפואת משפחה ומינהל" },
        { name: "פרופ' ז'אן סוסטיאל", license: "מ.ר. 22910", specialty: "נוירוכירורגיה וטראומת ראש" },
        { name: "ד\"ר איל חרמון", license: "מ.ר. 33820", specialty: "כירורגיה כללית" }
      ]
    },
    {
      id: "PROV-018",
      name: "המרכז הרפואי מאיר",
      city: "כפר סבא",
      license: "רישוי מוסד מס' 006",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' שמואל בנאי", license: "מ.ר. 12940", specialty: "קרדיולוגיה התערבותית" },
        { name: "ד\"ר אמיר אורון", license: "מ.ר. 23910", specialty: "אורתופדיה של כף יד ומרפק" },
        { name: "פרופ' אהוד בודנר", license: "מ.ר. 34821", specialty: "כירורגיית בית חזה ולב" }
      ]
    },
    {
      id: "PROV-019",
      name: "המרכז הרפואי סוראסקי (איכילוב)",
      city: "תל אביב",
      license: "רישוי מוסד מס' 001",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' רוני גמזו", license: "מ.ר. 10001", specialty: "גינקולוגיה ומינהל רפואי" },
        { name: "פרופ' צבי רם", license: "מ.ר. 10492", specialty: "נוירוכירורגיה וניתוחי מוח" },
        { name: "פרופ' יעקב ביקאלס", license: "מ.ר. 22849", specialty: "אורתופדיה אונקולוגית" },
        { name: "פרופ' אלי שפרכר", license: "מ.ר. 33912", specialty: "דרמטולוגיה ורפואת עור" },
        { name: "ד\"ר אורי יוגב", license: "מ.ר. 27741", specialty: "נוירולוגיה ומחלות שריר" }
      ]
    },
    {
      id: "PROV-020",
      name: "המרכז הרפואי סורוקה",
      city: "באר שבע",
      license: "רישוי מוסד מס' 010",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' שלומי קודש", license: "מ.ר. 10091", specialty: "רפואה פנימית" },
        { name: "פרופ' גדעון סהר", license: "מ.ר. 22840", specialty: "ניתוחי לב וחזה" },
        { name: "ד\"ר יואל גרינברג", license: "מ.ר. 33910", specialty: "אלרגיה ואימונולוגיה" },
        { name: "ד\"ר אילן שלף", license: "מ.ר. 44820", specialty: "נוירורדיולוגיה ודימות מוח" }
      ]
    },
    {
      id: "PROV-021",
      name: "המרכז הרפואי ע\"ש שיבא - תל השומר",
      city: "רמת גן",
      license: "רישוי מוסד מס' 002",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' יצחק קרייס", license: "מ.ר. 11005", specialty: "רפואה פנימית ומינהל" },
        { name: "פרופ' ארנון אפק", license: "מ.ר. 10022", specialty: "פתולוגיה ומדיניות בריאות" },
        { name: "פרופ' משה הדני", license: "מ.ר. 12948", specialty: "נוירוכירורגיה" },
        { name: "פרופ' יואב ינון", license: "מ.ר. 33829", specialty: "רפואת עובר והריון בסיכון" },
        { name: "פרופ' אלי שוורץ", license: "מ.ר. 44910", specialty: "מחלות זיהומיות ורפואת מטיילים" }
      ]
    },
    {
      id: "PROV-022",
      name: "המרכז הרפואי קפלן",
      city: "רחובות",
      license: "רישוי מוסד מס' 011",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' ציון חגי", license: "מ.ר. 10077", specialty: "מיילדות וגינקולוגיה" },
        { name: "פרופ' שמעון רוכקינד", license: "מ.ר. 22819", specialty: "נוירוכירורגיה ושחזור עצבים" },
        { name: "ד\"ר טל כהן", license: "מ.ר. 33902", specialty: "אורתופדיה" }
      ]
    },
    {
      id: "PROV-023",
      name: "המרכז הרפואי רבין (בילינסון)",
      city: "פתח תקווה",
      license: "רישוי מוסד מס' 004",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' דן ערבות", license: "מ.ר. 12948", specialty: "ניתוחי לב וחזה והשתלות" },
        { name: "ד\"ר אורי יוגב", license: "מ.ר. 27741", specialty: "נוירולוגיה" },
        { name: "פרופ' רן בליצר", license: "מ.ר. 55910", specialty: "בריאות הציבור ואפידמיולוגיה" }
      ]
    },
    {
      id: "PROV-024",
      name: "המרכז הרפואי רמב\"ם",
      city: "חיפה",
      license: "רישוי מוסד מס' 005",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' רפי ביאר", license: "מ.ר. 10088", specialty: "קרדיולוגיה התערבותית" },
        { name: "פרופ' ליאור גפשטיין", license: "מ.ר. 29402", specialty: "אלקטרופיזיולוגיה וקרדיולוגיה" },
        { name: "פרופ' ירון הר-שי", license: "מ.ר. 39401", specialty: "כירורגיה פלסטית וכוויות" }
      ]
    },
    {
      id: "PROV-025",
      name: "המרכז הרפואי שערי צדק",
      city: "ירושלים",
      license: "רישוי מוסד מס' 014",
      categories: ["surgery", "imaging", "consultation"],
      doctors: [
        { name: "פרופ' עופר מרין", license: "מ.ר. 10014", specialty: "כירורגיית לב וטראומה" },
        { name: "פרופ' יהונתן הלוי", license: "מ.ר. 10011", specialty: "רפואה פנימית ומחלות כבד" },
        { name: "פרופ' מוטי שגב", license: "מ.ר. 33829", specialty: "אף אוזן גרון וכירורגיית ראש צוואר" }
      ]
    },
    {
      id: "PROV-026",
      name: "מכון מור - בני ברק (מרכז ראשי)",
      city: "בני ברק",
      license: "מכון מור מס' 112",
      categories: ["imaging", "consultation"],
      doctors: [
        { name: "ד\"ר גלעד נוי", license: "מ.ר. 33910", specialty: "דימות שריר ושלד" },
        { name: "ד\"ר תמר רז", license: "מ.ר. 44912", specialty: "נוירורדיולוגיה ו-MRI" },
        { name: "ד\"ר אבי נוימן", license: "מ.ר. 55829", specialty: "קרדיולוגיה אבחנתית" }
      ]
    },
    {
      id: "PROV-027",
      name: "מכון מור - חיפה והצפון",
      city: "חיפה",
      license: "מכון מור מס' 114",
      categories: ["imaging", "consultation"],
      doctors: [
        { name: "ד\"ר רפאל שטרנברג", license: "מ.ר. 66102", specialty: "דימות מתקדם CT/MRI" },
        { name: "ד\"ר ורד יוגב", license: "מ.ר. 77192", specialty: "אולטרסאונד וממוגרפיה" }
      ]
    },
    {
      id: "PROV-028",
      name: "מכון מור - ירושלים",
      city: "ירושלים",
      license: "מכון מור מס' 113",
      categories: ["imaging", "consultation"],
      doctors: [
        { name: "ד\"ר ענת כהן", license: "מ.ר. 66192", specialty: "דימות נשים וממוגרפיה" },
        { name: "ד\"ר אלישע שטרן", license: "מ.ר. 77291", specialty: "CT ודימות פולשני" }
      ]
    },
    {
      id: "PROV-029",
      name: "מכון מאר (MAR) - מרכז ודימות",
      city: "תל אביב",
      license: "מכון מאר מס' 001",
      categories: ["imaging"],
      doctors: [
        { name: "ד\"ר יוסי גולדברג", license: "מ.ר. 88301", specialty: "דימות תהודה מגנטית (MRI)" },
        { name: "ד\"ר ליאורה פקר", license: "מ.ר. 99412", specialty: "אולטרסאונד מתקדם" }
      ]
    },
    {
      id: "PROV-030",
      name: "מכון הדמיה ודימות סורוקה (דרום)",
      city: "באר שבע",
      license: "מכון מאר מס' 008",
      categories: ["imaging"],
      doctors: [
        { name: "ד\"ר אילן שלף", license: "מ.ר. 44820", specialty: "נוירורדיולוגיה ודימות מוח" },
        { name: "ד\"ר מיכאל ברגר", license: "מ.ר. 55910", specialty: "דימות כלי דם ו-CT" }
      ]
    },
    {
      id: "PROV-031",
      name: "מרכז רפואי עין טל (ניתוחי עיניים)",
      city: "תל אביב",
      license: "רישוי מוסד מס' 551",
      categories: ["surgery", "consultation"],
      doctors: [
        { name: "פרופ' אירית בכר", license: "מ.ר. 12849", specialty: "רפואת עיניים וניתוחי קרנית" },
        { name: "ד\"ר שמואל לוינגר", license: "מ.ר. 23910", specialty: "ניתוחי קטרקט ולייזר" },
        { name: "ד\"ר איתי לביא", license: "מ.ר. 34901", specialty: "ניתוחי רשתית וזגוגית" }
      ]
    },
    {
      id: "PROV-032",
      name: "מרפאות מדיקה (Medica) - רמת החייל",
      city: "תל אביב",
      license: "רישוי מוסד מס' 990",
      categories: ["surgery", "consultation"],
      doctors: [
        { name: "פרופ' דוד ליבוביץ'", license: "מ.ר. 12940", specialty: "אורולוגיה וכירורגיה אונקולוגית" },
        { name: "ד\"ר רוני צבר", license: "מ.ר. 23849", specialty: "רפואה פליאטיבית ואיכות חיים" },
        { name: "ד\"ר איתן ברמן", license: "מ.ר. 34921", specialty: "רפואת עור ודרמטולוגיה" }
      ]
    },
    {
      id: "PROV-033",
      name: "מרכז רפואי משגב לדך",
      city: "ירושלים",
      license: "רישוי מוסד מס' 013",
      categories: ["surgery", "consultation", "imaging"],
      doctors: [
        { name: "ד\"ר אורי אברמסון", license: "מ.ר. 11092", specialty: "כירורגיה כללית" },
        { name: "ד\"ר נעמי ברזילי", license: "מ.ר. 22049", specialty: "גינקולוגיה" }
      ]
    },
    {
      id: "PROV-034",
      name: "מרפאות מכבידנט (רשת ארצית)",
      city: "בפריסה ארצית",
      license: "מ.ר.ש. 100",
      categories: ["dental"],
      doctors: [
        { name: "ד\"ר שאול רובינשטיין", license: "מ.ר.ש. 33921", specialty: "רופא שיניים מומחה לשיקום" },
        { name: "ד\"ר הילה אלון", license: "מ.ר.ש. 44182", specialty: "פריודונטיה (מחלות חניכיים)" },
        { name: "ד\"ר יואב צור", license: "מ.ר.ש. 55201", specialty: "כירורגיית פה ולסת" }
      ]
    },
    {
      id: "PROV-035",
      name: "מרפאות כללית סמייל (רשת ארצית)",
      city: "בפריסה ארצית",
      license: "מ.ר.ש. 200",
      categories: ["dental"],
      doctors: [
        { name: "ד\"ר אמיר כץ", license: "מ.ר.ש. 66190", specialty: "כירורגיית פה ולסת" },
        { name: "ד\"ר קרן ברגר", license: "מ.ר.ש. 77281", specialty: "רפואת שיניים לילדים ונוער" },
        { name: "ד\"ר גיא שפירא", license: "מ.ר.ש. 88301", specialty: "אורתודונטיה" }
      ]
    },
    {
      id: "PROV-036",
      name: "סופר פארם גן העיר - מחלקה מקצועית",
      city: "תל אביב",
      license: "מ.ר.פ. 003",
      categories: ["medication"],
      doctors: [
        { name: "פרופ' אליעזר זק", license: "מ.ר. 99301", specialty: "אונקולוגיה" },
        { name: "ד\"ר נועם שור", license: "מ.ר. 77102", specialty: "ראומטולוגיה ומחלות מפרקים" }
      ]
    },
    {
      id: "PROV-037",
      name: "קליניקה פרטית / רופא עצמאי",
      city: "עצמאי",
      license: "קליניקה מורשית",
      categories: ["consultation", "surgery", "dental", "imaging", "medication"],
      doctors: [
        { name: "ד\"ר אורי יוגב", license: "מ.ר. 7741", specialty: "נוירולוגיה וחוות דעת שנייה" },
        { name: "פרופ' אהוד רז", license: "מ.ר. 18294", specialty: "כירורגיה כללית" },
        { name: "ד\"ר שאול רובינשטיין", license: "מ.ר.ש. 33921", specialty: "שיקום הפה" },
        { name: "פרופ' איתמר רז", license: "מ.ר. 10294", specialty: "אנדוקרינולוגיה וסוכרת" },
        { name: "פרופ' אליעזר זק", license: "מ.ר. 99301", specialty: "אונקולוגיה" }
      ]
    }
  ],

  // Rejection Reason Codes
  rejectionReasons: [
    { code: "REJ-01", title: "טיפול שבוצע לפני מועד תחילת הביטוח", category: "תוקף פוליסה" },
    { code: "REJ-02", title: "תקופת אכשרה טרם הסתיימה", category: "אכשרה" },
    { code: "REJ-03", title: "הטיפול / השירות מוחרג בפוליסה", category: "כיסוי והחרגות" },
    { code: "REJ-04", title: "היעדר מסמכים רפואיים חיוניים חרף תזכורות", category: "מסמכים" },
    { code: "REJ-05", title: "אי-התאמה מהותית בין המסמכים לתביעה", category: "אימות נתונים" },
    { code: "REJ-06", title: "תביעה כפולה (הוצאה שכבר שולמה או נתבעה בעבר)", category: "כפילות" },
    { code: "REJ-07", title: "ספק/רופא שאינו עומד בתנאי ההסכם או רישוי מוכר", category: "ספק שירות" }
  ],

  // Single Demo Claim for Referent Guardianship Inspection
  guardianDemoClaim: {
    id: "CLM-2026-8815",
    customerName: "רחל ישראלי (אפוטרופוס: ישראל ישראלי)",
    customerId: "019283746",
    policyNumber: "POL-773291-IL",
    claimType: "consultation",
    claimTypeName: "ייעוץ מומחה וחוות דעת",
    submissionDate: "2026-10-08 11:15",
    serviceDate: "2026-09-22",
    claimedAmount: 1800,
    providerName: "מרכז רפואי רמת אביב",
    providerLicense: "רישוי מוסד מס' 302",
    doctorName: "פרופ' איתמר רז (אנדוקרינולוגיה)",
    status: "Under Human Review",
    assignedHandlerId: "HND-04",
    assignedHandlerName: "רונית לוי",
    riskScore: "Low",
    aiConfidence: 0.96,
    isGuardian: true,
    guardianData: {
      isApproved: true,
      wardName: "רחל ישראלי",
      wardId: "019283746",
      guardianName: "ישראל ישראלי",
      guardianId: "028475913",
      courtCase: 'א"פ 42918-03-24',
      courtName: "בית המשפט לענייני משפחה - מחוז תל אביב",
      appointmentType: "צו מינוי אפוטרופוס מבית המשפט לענייני משפחה",
      scope: "עניינים רפואיים, ביטוחיים ואישיים",
      approvalDate: "12/03/2024",
      documentName: "צו_מינוי_אפוטרופוס_בימש_משפחה_חתום.pdf",
      verifiedAt: "2026-03-12T10:00:00Z"
    },
    preValidation: {
      summary: "תביעה מכוח אפוטרופסות הוגשה ע\"י ישראל ישראלי עבור רחל ישראלי. צו בית משפט אומת ומאושר דיגיטלית.",
      checks: [
        { code: "CHK-LEGAL", name: "בדיקת כשרות משפטית וצו אפוטרופסות", passed: true, detail: "צו בימ\"ש בתוקף (תיק א\"פ 42918-03-24), סמכות רפואית מאושרת" },
        { code: "CHK-COV", name: "תוקף פוליסה", passed: true, detail: "פוליסה פעילה" },
        { code: "CHK-WAIT", name: "תקופת אכשרה", passed: true, detail: "הסתיימה מלאה" },
        { code: "CHK-DUP", name: "סריקת כפילויות", passed: true, detail: "לא אותרה כפילות" },
        { code: "CHK-AMT", name: "אימות סכום", passed: true, detail: "₪1,800 תואם לחשבונית" },
        { code: "CHK-DOCS", name: "שלמות מסמכים", passed: true, detail: "כל המסמכים צורפו כדין" }
      ],
      explainability: "תביעה תקינה שהוגשה כדין ע\"י אפוטרופוס ממונה עם צו שיפוטי תקף ומאומת במלואו."
    },
    documents: [
      { id: "DOC-501", type: "invoice", name: "חשבונית_ייעוץ_רמת_אביב.pdf", size: "920KB", uploadDate: "2026-10-08 11:15", status: "Verified", ocrConfidence: 0.98 },
      { id: "DOC-502", type: "guardian_court_order", name: "צו_מינוי_אפוטרופוס_בימש_משפחה_חתום.pdf", size: "1.4MB", uploadDate: "2026-10-08 11:15", status: "Verified", ocrConfidence: 0.99 }
    ],
    auditTrail: [
      { timestamp: "2026-10-08 11:15:00", user: "פורטל מבוטח", action: "התביעה הוגשה ע\"י האפוטרופוס ישראל ישראלי עבור רחל ישראלי בליווי צו שיפוטי א\"פ 42918-03-24" },
      { timestamp: "2026-10-08 11:15:02", user: "מנוע אימות AI", action: "צו האפוטרופסות אומת דיגיטלית מול משרד המשפטים ואושר אוטומטית." }
    ]
  },

  // Claims Database
  claims: [
    {
      id: "CLM-2026-8813",
      customerName: "שירן גולדמן",
      customerId: "031892044",
      policyNumber: "POL-992015-IL",
      claimType: "dental",
      claimTypeName: "טיפולי שיניים מורכבים",
      submissionDate: "2026-10-07 08:20",
      serviceDate: "2026-09-15",
      claimedAmount: 6200,
      providerName: "מרפאת דנטל קייר",
      providerLicense: "מ.ר.ש. 882",
      doctorName: "ד\"ר שאול רובינשטיין",
      status: "Waiting for Customer",
      assignedHandlerId: "HND-05",
      assignedHandlerName: "דניאל גרינברג",
      riskScore: "Medium",
      aiConfidence: 0.72,

      preValidation: {
        summary: "נשלחה בקשה ללקוחה לצירוף צילומי רנטגן ותוכנית טיפול.",
        checks: [
          { code: "CHK-COV", name: "תוקף פוליסה", passed: true, detail: "פוליסה פעילה" },
          { code: "CHK-WAIT", name: "תקופת אכשרה", passed: true, detail: "עברה שנה" },
          { code: "CHK-DUP", name: "בדיקת כפילות", passed: true, detail: "תקין" },
          { code: "CHK-AMT", name: "אימות סכום", passed: true, detail: "₪6,200 תואם לקבלה" },
          { code: "CHK-DOCS", name: "שלמות מסמכים", passed: false, severity: "hard_blocker", detail: "חסרים צילומי רנטגן לפני ואחרי הטיפול" }
        ],
        extractedOcrData: {
          invoice: {
            detectedName: "שירן גולדמן",
            detectedId: "031892044",
            detectedDate: "2026-09-15",
            detectedAmount: 6200,
            detectedProvider: "דנטל קייר בע\"מ",
            detectedInvoiceNumber: "DC-44019",
            ocrConfidence: 0.91
          }
        },
        explainability: "בתביעות טיפולי שיניים מורכבים מעל ₪5,000 נדרש על פי פוליסה צירוף צילומי רנטגן מקדימים. נשלחה הודעה אוטומטית ומפורטת למבוטחת."
      },

      documents: [
        { id: "DOC-401", type: "invoice", name: "קבלה_דנטל_קייר.pdf", size: "750KB", uploadDate: "2026-10-07 08:20", status: "Verified" },
        { id: "DOC-402", type: "treatment_plan", name: "צילומי רנטגן ותוכנית טיפול", size: null, uploadDate: null, status: "Missing" }
      ],

      corrections: [],
      auditTrail: [
        { timestamp: "2026-10-07 08:22:00", user: "מערכת התראות מבוטחים", action: "נשלח SMS ודוא\"ל למבוטחת עם קישור ישיר להעלאת צילומי הרנטגן." }
      ]
    },

    {
      id: "CLM-2026-8810",
      customerName: "ישראל ישראלי",
      customerId: "028475913",
      policyNumber: "POL-773291-IL",
      claimType: "surgery",
      claimTypeName: "ניתוח ואשפוז בארץ",
      submissionDate: "2026-10-06 09:30",
      serviceDate: "2026-09-28",
      claimedAmount: 18500,
      providerName: "בי\"ח אסותא רמת החייל",
      providerLicense: "רישוי מוסד מס' 449",
      doctorName: "פרופ' אהוד רז (מנתח)",
      status: "Under Human Review",
      assignedHandlerId: "HND-04",
      assignedHandlerName: "רונית לוי",
      riskScore: "Medium",
      aiConfidence: 0.88,
      hasVariance: true,
      varianceExplanation: "ההפרש בסך ₪1,700 שולם כמקדמה ישירה לחברת השתלים (חשבונית מקדמה צורפה בהתאם להנחיות).",

      // AI Pre-Validation Layer Findings
      preValidation: {
        summary: "זוהתה אי-התאמה קלה בסכום החשבונית (קיים הסבר מבוטח) וחסר מסמך דו\"ח ניתוח מפורט.",
        checks: [
          { code: "CHK-COV", name: "בדיקת תוקף פוליסה בתאריך הטיפול", passed: true, detail: "פוליסה פעילה ברציפות משנת 2021" },
          { code: "CHK-WAIT", name: "בדיקת תקופת אכשרה", passed: true, detail: "עבר 68 חודשים (נדרש: 6 חודשים)" },
          { code: "CHK-DUP", name: "סריקת תביעות כפולות", passed: true, detail: "לא אותרה תביעה זהה במערכת" },
          { code: "CHK-AMT", name: "השוואת סכום נתבע מול חשבונית OCR", passed: false, severity: "soft_variance", detail: "סכום נתבע: ₪18,500 | חשבונית שפוענחה: ₪16,800 (הפרש ₪1,700 - קיים הסבר מבוטח על שתלים)" },
          { code: "CHK-DOCS", name: "שלמות מסמכים נדרשים", passed: false, severity: "hard_blocker", detail: "חסר דו\"ח ניתוח רשמי חתום ע\"י המנתח" }
        ],
        extractedOcrData: {
          invoice: {
            detectedName: "ישראל ישראלי",
            detectedId: "028475913",
            detectedDate: "2026-09-28",
            detectedAmount: 16800,
            detectedProvider: "אסותא מרכזים רפואיים בע\"מ",
            detectedInvoiceNumber: "INV-992014-A",
            ocrConfidence: 0.96,
            imageUrl: "assets/sample_invoice_1.png"
          },
          discharge: {
            detectedDiagnosis: "בקע מפשעתי חוזר (Inguinal Hernia Repair)",
            detectedDate: "2026-09-28",
            detectedHospital: "אסותא רמת החייל",
            ocrConfidence: 0.92,
            imageUrl: "assets/sample_discharge_1.png"
          }
        },
        explainability: "התביעה נותבה לבדיקת רפרנט אנושי מכיוון שסכום החשבונית המפוענח (₪16,800) אינו תואם בדיוק לסכום המוצהר (₪18,500 - קיים הסבר מבוטח על מקדמת שתלים), וכן חסר דו\"ח מנתח חתום כנדרש בנספח ניתוחים."
      },

      documents: [
        { id: "DOC-101", type: "invoice", name: "חשבונית_אסותא_ספטמבר.pdf", size: "1.4MB", uploadDate: "2026-10-06 09:30", status: "Verified", ocrConfidence: 0.96 },
        { id: "DOC-102", type: "discharge", name: "מכתב_שחרור_אסותא.pdf", size: "2.1MB", uploadDate: "2026-10-06 09:31", status: "Verified", ocrConfidence: 0.93 },
        { id: "DOC-103", type: "op_report", name: "דו\"ח ניתוח חתום", size: null, uploadDate: null, status: "Missing", ocrConfidence: null }
      ],

      corrections: [],
      customerEdits: [
        {
          field: "סכום נתבע",
          previousValue: "₪16,800 (מסריקת חשבונית OCR)",
          newValue: "₪18,500",
          discrepancy: "+₪1,700 (חריגה מסריקה)",
          hasOcrDiscrepancy: true,
          explanation: "ההפרש בסך ₪1,700 שולם כמקדמה ישירה לחברת השתלים (חשבונית מקדמה צורפה בהתאם להנחיות).",
          timestamp: "2026-10-06 09:28:45",
          user: "ישראל ישראלי (מבוטח - עריכה טרום-הגשה)"
        }
      ],
      auditTrail: [
        { timestamp: "2026-10-06 09:28:45", user: "ישראל ישראלי (מבוטח - שלב 4)", action: "עריכת סכום נתבע: עודכן מ-₪16,800 (סריקת OCR) ל-₪18,500. הסבר מבוטח: 'ההפרש בסך ₪1,700 שולם כמקדמה ישירה לחברת השתלים (חשבונית מקדמה צורפה בהתאם להנחיות).'" },
        { timestamp: "2026-10-06 09:32:10", user: "מנוע אימות AI (מערכת)", action: "פענוח OCR ובדיקות זכאות הושלמו. הופקו 2 התראות." },
        { timestamp: "2026-10-06 09:35:00", user: "מנוע ניתוב חכם", action: "התביעה שובצה לרפרנטית רונית לוי לפי עומס ומומחיות בניתוחים." }
      ]
    },

    {
      id: "CLM-2026-8812",
      customerName: "משה קליין",
      customerId: "019928374",
      policyNumber: "POL-339812-IL",
      claimType: "consultation",
      claimTypeName: "ייעוץ רופא מומחה (חוות דעת שנייה)",
      submissionDate: "2026-10-05 16:40",
      serviceDate: "2026-10-01",
      claimedAmount: 1800,
      providerName: "קליניקה פרטית - ד\"ר אורי יוגב",
      providerLicense: "מ.ר. 7741",
      doctorName: "ד\"ר אורי יוגב (נוירולוג)",
      status: "Under Human Review",
      assignedHandlerId: "HND-04",
      assignedHandlerName: "רונית לוי",
      riskScore: "High",
      aiConfidence: 0.64,

      preValidation: {
        summary: "זוהתה תביעה כפולה פוטנציאלית: מספר חשבונית קיים כבר בתביעה מ-2025.",
        checks: [
          { code: "CHK-COV", name: "בדיקת תוקף פוליסה", passed: true, detail: "פוליסה בתוקף" },
          { code: "CHK-WAIT", name: "תקופת אכשרה", passed: true, detail: "הסתיימה" },
          { code: "CHK-DUP", name: "בדיקת כפילות תביעות", passed: false, severity: "hard_blocker", detail: "אזהרת כפילות חמורה: חשבונית מס' INV-771802 כבר שולמה במלואה בתביעה CLM-2025-4109 בתאריך 14/11/2025!" },
          { code: "CHK-AMT", name: "אימות סכום", passed: true, detail: "סכום ₪1,800 תואם לקבלה" },
          { code: "CHK-DOCS", name: "שלמות מסמכים", passed: true, detail: "מסמכים צורפו" }
        ],
        extractedOcrData: {
          invoice: {
            detectedName: "משה קליין",
            detectedId: "019928374",
            detectedDate: "2026-10-01",
            detectedAmount: 1800,
            detectedProvider: "מרפאת מומחים נוירולוגיה",
            detectedInvoiceNumber: "INV-771802",
            ocrConfidence: 0.94
          }
        },
        explainability: "התביעה נחסמה ועברה לבדיקה מיוחדת בעקבות זיהוי מספר חשבונית זהה לחשבונית שכבר נפרעה בעבר (חשד לתביעה כפולה)."
      },

      documents: [
        { id: "DOC-301", type: "invoice", name: "חשבונית_ד_ר_יוגב.pdf", size: "920KB", uploadDate: "2026-10-05 16:40", status: "Flagged" },
        { id: "DOC-302", type: "summary_letter", name: "מכתב_סיכום_ייעוץ.pdf", size: "1.1MB", uploadDate: "2026-10-05 16:40", status: "Verified" }
      ],

      corrections: [],
      auditTrail: [
        { timestamp: "2026-10-05 16:42:00", user: "מנוע מניעת הונאות וכפילויות", action: "הופעלה התראת כפילות ברמת חומרה גבוהה על חשבונית INV-771802." }
      ]
    },

    {
      id: "CLM-2026-8811",
      customerName: "דפנה ארזי",
      customerId: "054391827",
      policyNumber: "POL-661204-IL",
      claimType: "imaging",
      claimTypeName: "בדיקות דימות מתקדמות (MRI, CT, PET)",
      submissionDate: "2026-10-06 11:15",
      serviceDate: "2026-10-02",
      claimedAmount: 3400,
      providerName: "מכון מור - בני ברק",
      providerLicense: "מכון מור מס' 112",
      doctorName: "ד\"ר גלעד נוי",
      status: "Under Human Review",
      assignedHandlerId: "HND-02",
      assignedHandlerName: "מאיה אברהם",
      riskScore: "Low",
      aiConfidence: 0.97,

      preValidation: {
        summary: "כל המסמכים תקינים, הנתונים הושוו ב-100% דיוק ואין חריגות.",
        checks: [
          { code: "CHK-COV", name: "בדיקת תוקף פוליסה", passed: true, detail: "פוליסה בתוקף" },
          { code: "CHK-WAIT", name: "תקופת אכשרה", passed: true, detail: "הסתיימה" },
          { code: "CHK-DUP", name: "בדיקת כפילות", passed: true, detail: "ייחודית" },
          { code: "CHK-AMT", name: "אימות סכום מול קבלה", passed: true, detail: "סכום תואם בדיוק: ₪3,400" },
          { code: "CHK-DOCS", name: "שלמות מסמכים", passed: true, detail: "כל 3 המסמכים הנדרשים צורפו ותקינים" }
        ],
        extractedOcrData: {
          invoice: {
            detectedName: "דפנה ארזי",
            detectedId: "054391827",
            detectedDate: "2026-10-02",
            detectedAmount: 3400,
            detectedProvider: "מכון מור לבדיקות רפואיות בע\"מ",
            detectedInvoiceNumber: "MOR-88310",
            ocrConfidence: 0.99
          }
        },
        explainability: "התביעה מוכנה לאישור מהיר (Fast-Track). כל המסמכים תואמים במלואם, זכאות מאומתת."
      },

      documents: [
        { id: "DOC-201", type: "invoice", name: "קבלה_מור_MRI.pdf", size: "890KB", uploadDate: "2026-10-06 11:15", status: "Verified" },
        { id: "DOC-202", type: "referral", name: "הפניה_אורתופד_ד_ר_נוי.pdf", size: "650KB", uploadDate: "2026-10-06 11:15", status: "Verified" },
        { id: "DOC-203", type: "imaging_result", name: "פענוח_MRI_ברך_ימין.pdf", size: "1.2MB", uploadDate: "2026-10-06 11:15", status: "Verified" }
      ],

      corrections: [],
      auditTrail: [
        { timestamp: "2026-10-06 11:16:00", user: "מנוע אימות AI (מערכת)", action: "אימות עבר בהצלחה מלאה. דירוג סיכון: נמוך (0.97)" }
      ]
    },

    {
      id: "CLM-2026-8814",
      customerName: "יונתן פלג",
      customerId: "049281720",
      policyNumber: "POL-110294-IL",
      claimType: "medication",
      claimTypeName: "תרופות מחוץ לסל הבריאות",
      submissionDate: "2026-10-04 14:10",
      serviceDate: "2026-09-20",
      claimedAmount: 14200,
      providerName: "סופר פארם גן העיר",
      providerLicense: "מ.ר.פ. 003",
      doctorName: "פרופ' אליעזר זק",
      status: "Approved",
      assignedHandlerId: "HND-08",
      assignedHandlerName: "שירה אזולאי",
      riskScore: "Low",
      aiConfidence: 0.95,
      approvedAmount: 14200,
      approvalDate: "2026-10-05 10:30",

      preValidation: {
        summary: "התביעה נבדקה ואושרה במלואה על ידי רפרנטית מוסמכת לאחר אימות מרשם 29ג.",
        checks: [
          { code: "CHK-COV", name: "כיסוי תרופות מחוץ לסל", passed: true, detail: "מכוסה במסגרת נספח תרופות מתקדמות" },
          { code: "CHK-WAIT", name: "אכשרה", passed: true, detail: "הסתיימה" },
          { code: "CHK-DUP", name: "כפילות", passed: true, detail: "תקין" },
          { code: "CHK-AMT", name: "סכום", passed: true, detail: "₪14,200 תואם לחשבונית" },
          { code: "CHK-DOCS", name: "מרשם וטופס 29ג", passed: true, detail: "חתום ע\"י רופא מורשה משרד הבריאות" }
        ],
        extractedOcrData: {
          invoice: {
            detectedName: "יונתן פלג",
            detectedId: "049281720",
            detectedDate: "2026-09-20",
            detectedAmount: 14200,
            detectedProvider: "סופר פארם (ישראל) בע\"מ",
            detectedInvoiceNumber: "SP-8827101",
            ocrConfidence: 0.98
          }
        },
        explainability: "כל תנאי הזכאות התקיימו במלואם. אושר להעברה לתשלום."
      },

      documents: [
        { id: "DOC-501", type: "invoice", name: "חשבונית_סופר_פארם.pdf", size: "1.1MB", uploadDate: "2026-10-04 14:10", status: "Verified" },
        { id: "DOC-502", type: "prescription", name: "מרשם_וטופס_29ג_חתום.pdf", size: "1.6MB", uploadDate: "2026-10-04 14:10", status: "Verified" }
      ],

      corrections: [],
      auditTrail: [
        { timestamp: "2026-10-04 14:12:00", user: "מנוע אימות AI", action: "זיהוי נתונים ומרשם 29ג עבר בדיקה תקינה." },
        { timestamp: "2026-10-05 10:30:15", user: "שירה אזולאי (רפרנטית תביעות)", action: "התביעה אושרה לתשלום מלא על סך ₪14,200 לאחר בדיקת תנאי הפוליסה." }
      ]
    }
  ],

  // Interactive Demo Presets for Quick Testing (Pre-Validation Prevention & Workflows)
  demoScenarios: [
    {
      id: "duplicate_claim",
      title: "1. חסימת תביעה כפולה (Duplicate Block)",
      badge: "חסימת מנע",
      badgeClass: "badge-danger",
      category: "מניעת כפילויות",
      description: "ניסיון לתבוע חשבונית שכבר שולמה בעבר (INV-771802). המערכת חוסמת את ההגשה לחלוטין, מציגה הודעה מנומסת ומפנה לסטטוס התביעה הקיימת.",
      claimId: "CLM-2026-8812",
      blockType: "duplicate",
      politeMessage: "זוהתה במערכת תביעה קודמת זהה שכבר הוגשה או נפרעה עבור טיפול זה (חשבונית מס' INV-771802 מיום 01/10/2026 על סך ₪1,800).",
      proposedSolution: "באפשרותך לעקוב אחר סטטוס הטיפול בתביעה הקיימת ואישורי התשלום בפורטל התביעות האישי שלך."
    },
    {
      id: "uncovered_treatment",
      title: "2. חסימה: שירות אינו מכוסה בפוליסה (Uncovered)",
      badge: "חסימת מנע",
      badgeClass: "badge-danger",
      category: "זכאות פוליסה",
      description: "בחירת טיפול ברפואה משלימה שאינו כלול בפוליסה. המערכת חוסמת את הבקשה ומסבירה בצורה ברורה כי השירות אינו נכלל בכיסויי הפוליסה.",
      blockType: "uncovered",
      politeMessage: "פוליסת הבריאות שברשותך ('אופק פרימיום מורחב') אינה כוללת כיסוי עבור טיפולי רפואה משלימה ואלטרנטיבית.",
      proposedSolution: ""
    },
    {
      id: "waiting_period",
      title: "3. חסימה: טיפול במהלך תקופת אכשרה (Waiting Period)",
      badge: "חסימת מנע",
      badgeClass: "badge-danger",
      category: "תקופת אכשרה",
      description: "תאריך הטיפול חל בתוך תקופת האכשרה הנדרשת בפוליסה (12 חודשים, מסתיימת ב-01/06/2027). המערכת חוסמת ומסבירה מאיזה תאריך ניתן להגיש.",
      blockType: "waiting_period",
      politeMessage: "תאריך ביצוע הטיפול שהוזן (15/09/2026) חל בתוך תקופת האכשרה הנדרשת בפוליסה עבור כיסוי שיניים מורכבים (תקופת אכשרה מסתיימת ב-01/06/2027).",
      proposedSolution: "באפשרותך להגיש תביעות להחזר כספי עבור טיפולים שיבוצעו החל מיום 01/06/2027 ואילך."
    },
    {
      id: "coverage_added_later",
      title: "4. חסימה: הכיסוי נוסף לאחר תאריך הטיפול (Added Later)",
      badge: "חסימת מנע",
      badgeClass: "badge-danger",
      category: "תוקף כיסוי",
      description: "מועד ביצוע הטיפול המבוקש (15/02/2025) קודם למועד הוספת נספח הכיסוי הרפואי לפוליסה שלך (01/06/2026).",
      blockType: "added_later",
      politeMessage: "מועד ביצוע הטיפול המבוקש (15/02/2025) קודם למועד הוספת נספח הכיסוי הרפואי לפוליסה שלך (01/06/2026).",
      proposedSolution: "באפשרותך להגיש תביעות עבור טיפולים ופרוצדורות שבוצעו החל מתאריך תחילת הכיסוי (01/06/2026) ואילך."
    },
    {
      id: "coverage_cancelled_early",
      title: "5. חסימה: הכיסוי בוטל לפני תאריך הטיפול (Cancelled Early)",
      badge: "חסימת מנע",
      badgeClass: "badge-danger",
      category: "תוקף כיסוי",
      description: "תאריך הטיפול (20/09/2026) מאוחר למועד שבו בוטל הכיסוי הרפואי בפוליסה (01/05/2026). המערכת חוסמת ומציעה פנייה לחידוש.",
      blockType: "cancelled_early",
      politeMessage: "מועד ביצוע הטיפול המבוקש (20/09/2026) חל לאחר מועד ביטול הכיסוי הרפואי בפוליסה (בוטל ביום 01/05/2026).",
      proposedSolution: "באפשרותך לפנות לשירות הלקוחות בטלפון *6540 לבדיקת אפשרות לחידוש הכיסוי הרפואי או הגשת בקשה חריגה."
    },
    {
      id: "unreadable_doc",
      title: "6. דחיית מסמך לא קריא / מטושטש (OCR < 50%)",
      badge: "איכות מסמכים",
      badgeClass: "badge-danger",
      category: "אימות OCR",
      description: "מנוע ה-AI מזהה סריקה מטושטשת ובלתי קריאה. המערכת חוסמת את ההתקדמות ודורשת העלאה מחודשת של מסמך ברור וקריא.",
      blockType: "unreadable_doc",
      politeMessage: "המסמך שהועלה מטושטש או באיכות סריקה נמוכה מכדי שניתן יהיה לזהות את הנתונים.",
      proposedSolution: "אנא העלה צילום ברור, ישר ומואר היטב של המסמך המקורי לצורך המשך הטיפול בתביעה."
    },
    {
      id: "low_confidence_doc",
      title: "7. מסמך באיכות נמוכה (OCR 50-85%) - אפשרות להעברה לנציג",
      badge: "בדיקה אנושית",
      badgeClass: "badge-warning",
      category: "אימות OCR",
      description: "איכות מסמך בינונית (68%). המערכת מציעה להעלות עותק ברור יותר או לסמן שאין עותק אחר ולהעביר לבדיקה ידנית של רפרנט.",
      blockType: "low_confidence_doc",
      politeMessage: "איכות הסריקה בינונית (ציון קריאות 68%). כדי למנוע עיכובים בטיפול, מומלץ להעלות מסמך ברור יותר.",
      proposedSolution: "באפשרותך לצרף סריקה חדה יותר, או לסמן 'אין ברשותי עותק ברור יותר' והתביעה תועבר לבדיקה ידנית של רפרנט."
    },
    {
      id: "mismatched_amount",
      title: "8. אי-התאמה רכה בסכום (Soft Variance - סנכרון)",
      badge: "אי-התאמה",
      badgeClass: "badge-warning",
      category: "אימות נתונים",
      description: "סכום בטופס ₪18,500 מול חשבונית ₪16,800. פתיחת חלון השוואה וסנכרון בלחיצה אחת או שליחה לנציג עם הסבר מבוטח.",
      claimId: "CLM-2026-8810"
    },
    {
      id: "missing_mandatory_doc",
      title: "9. מסמך חובה חסר (Missing Info Blocker)",
      badge: "השלמת מידע",
      badgeClass: "badge-warning",
      category: "שלמות מסמכים",
      description: "תביעת ניתוח ללא דו\"ח מנתח. Review Hub מתריע וחוסם התקדמות עד לצירוף המסמך החסר.",
      claimId: "CLM-2026-8813"
    },
    {
      id: "clean_fast_track",
      title: "10. תביעה נקייה ושלמה (Fast-Track 100%)",
      badge: "אישור מהיר",
      badgeClass: "badge-success",
      category: "מסלול ירוק",
      description: "כל המסמכים והנתונים תואמים ב-100% (98% קונפידנס). התביעה עוברת ישירות לאישור מהיר של הרפרנטית.",
      claimId: "CLM-2026-8811"
    },
    {
      id: "high_amount_warning",
      title: "11. אזהרת סכום חריג והמלצה לאסמכתת תשלום",
      badge: "המלצה",
      badgeClass: "badge-warning",
      category: "אימות סכום",
      description: "הזנת סכום גבוה מהסף המקובל לקטגוריה (מעל ₪2,000 בייעוץ / ₪10,000 בניתוח). מודאל אזהרה מציע לצרף אסמכתת תשלום לזירוז הטיפול.",
      claimId: "CLM-2026-8814"
    },
    {
      id: "guardian_claim",
      title: "12. תביעת אפוטרופוס מאושרת (לבדיקת רפרנט)",
      badge: "אפוטרופסות",
      badgeClass: "badge-info",
      category: "בדיקת רפרנט",
      description: "הדגמת בדיקת תביעה שהוגשה כדין ע\"י אפוטרופוס עם צו שיפוטי מאומת. מציג לרפרנטית באנר משפטי מפורט, פרטי חסוי/מיוצג וצו בימ\"ש.",
      claimId: "CLM-2026-8815"
    }
  ],

  // Department KPI Baseline Metrics (for Management Dashboard)
  metrics: {
    totalClaimsThisMonth: 1420,
    dailyDocumentVolume: 612,
    avgProcessingTimeHours: 4.8,
    timeSavedPercent: 42,
    cleanPassRate: "78.4%",
    ocrAccuracyRate: "94.6%",
    correctionsCount: 84,
    claimsByStatus: {
      "הוגשה במערכת (חדשה)": 42,
      "ממתין להשלמת מבוטח": 135,
      "בבדיקת רפרנט אנושי": 210,
      "אושרה לתשלום": 845,
      "נדחתה": 120
    },
    claimsByRisk: {
      "Low": 940,
      "Medium": 360,
      "High": 120
    },
    rejectionsByCategory: {
      "תקופת אכשרה": 38,
      "החרגה בפוליסה": 29,
      "אי-התאמה / מסמכים חסרים": 24,
      "תביעה כפולה": 18,
      "טיפול לפני תחילת ביטוח": 11
    }
  }
};

// Export to global window
if (typeof window !== "undefined") {
  window.MOCK_DATA = MOCK_DATA;
}

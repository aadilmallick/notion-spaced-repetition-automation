interface Name {
  id: string;
  type: string;
  title: {
    type: string;
    text: {
      content: string;
      link: string | null;
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href: string | null;
  }[];
}

interface NextReviewDate {
  id: string;
  type: string;
  formula: {
    type: string;
    date: {
      start: string;
      end: string | null;
      time_zone: string | null;
    };
  };
}

interface Status {
  id: string;
  type: string;
  formula: {
    type: string;
    string: string;
  };
}

interface LastReviewedDate {
  id: string;
  type: string;
  date: {
    start: string;
    end: string | null;
    time_zone: string | null;
  };
}

declare module "react-native-mlkit-ocr" {
  export interface TextBlock {
    text: string;
  }

  export type MlkitOcrResult = TextBlock[];

  export default class MlkitOcr {
    static detectFromUri(uri: string): Promise<MlkitOcrResult>;
  }
}

export interface OcrApiResponse {
  ParsedResults: {
    ParsedText: string;
    TextOverlay?: {
      Lines?: any[];
    };
  }[];
}

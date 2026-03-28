import { index } from "../services/ai.service.js";
import { generateEmbedding } from "./generateEmbedding.js";
import { generateShortContent } from "./generateShortContent.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const GenrateVectorEmbedding = async ({ title, description, userid, docId }) => {
  
  const text = await generateShortContent({ title, description })
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 50,
    chunkOverlap: 0,
  });

  const chunks = await splitter.splitText(text);

  const records = await Promise.all(
    chunks.map(async (chunk, i) => {
      const embedding = await generateEmbedding(chunk)
      return {
        id: `doc-${userid}-${docId}-chunk-${i}`,
        values: embedding,
        metadata: {
          userId: userid,
          documentId: docId,
          text: chunk,
        }
      }
    })
  );
  await index.upsert({ records })
}

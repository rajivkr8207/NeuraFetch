import { index } from "../services/ai.service.js";
import { generateEmbedding } from "./generateEmbedding.js";
import { generateShortContent } from "./generateShortContent.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export  const GenrateVectorEmbedding = async ({ title, description }) => {
  const text = await generateShortContent({ title, description })
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 50,
    chunkOverlap: 0,
  });

  const chunks = await splitter.splitText(text);

  const docs = await Promise.all(
    chunks.map(async (chunk, i) => {
      const embedding = await generateEmbedding(chunk)
      return {
        text: chunk,
        embedding
      }
    })
  );

  const result = await index.upsert({
    records: docs.map((doc, i) => ({
      id: `doc-${Date.now()}`,
      values: doc.embedding,
      metadata: {
        title: doc.text
      }
    }))
  })

  return result
}

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!dbInstance) {
    const url = process.env.DB_URL;
    const token = process.env.DB_TOKEN;
    
    if (!url) {
      throw new Error("DB_URL not set");
    }
    
    const client = createClient({
      url,
      authToken: token,
    });
    
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get() {
    return getDb();
  }
});

export { schema };
export const { admin, siteSettings, photos, projects, blogPosts, timelineEvents, connectionRequests } = schema;
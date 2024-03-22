import { driver, process as gprocess, structure } from "gremlin";
const Graph = structure.Graph;

const {
  t: { id },
  cardinality: { single },
} = gprocess;

async function main() {
  const endpoint =
    "wss://neptunedbcluster-3eonzmpplvr8.cluster-cficukiiur66.us-east-1.neptune.amazonaws.com";
  const graph = new Graph();
  const connection = new driver.DriverRemoteConnection(endpoint, {
    mimeType: "application/vnd.gremlin-v2.0+json",
  });
  const g = graph.traversal().withRemote(connection);

  try {
    // Example: Add a new vertex
    const newUser = await g
      .addV("User")
      .property(id, "user1")
      .property(single, "name", "John Doe")
      .property("age", 30)
      .next();
    console.log(`Added user: ${JSON.stringify(newUser)}`);

    // Example: Add another vertex and create an edge between them
    const newUser2 = await g
      .addV("User")
      .property(id, "user2")
      .property(single, "name", "Jane Doe")
      .property("age", 28)
      .next();
    await g.V("user1").addE("knows").to(g.V("user2")).next();
    console.log("Added a friend relationship between user1 and user2");

    // Commit the transaction
    await connection.close();
  } catch (error) {
    console.error("Failed to populate Neptune:", error);
  }
}

main();

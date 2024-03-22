"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
const gremlin_1 = require("gremlin");
const Graph = gremlin_1.structure.Graph;
const {
  t: { id },
  cardinality: { single },
} = gremlin_1.process;
function main() {
  return __awaiter(this, void 0, void 0, function* () {
    const endpoint =
      "wss://neptunedbcluster-3eonzmpplvr8.cluster-cficukiiur66.us-east-1.neptune.amazonaws.com";
    const graph = new Graph();
    const connection = new gremlin_1.driver.DriverRemoteConnection(endpoint, {
      mimeType: "application/vnd.gremlin-v2.0+json",
    });
    const g = graph.traversal().withRemote(connection);
    try {
      // Example: Add a new vertex
      const newUser = yield g
        .addV("User")
        .property(id, "user1")
        .property(single, "name", "John Doe")
        .property("age", 30)
        .next();
      console.log(`Added user: ${JSON.stringify(newUser)}`);
      // Example: Add another vertex and create an edge between them
      const newUser2 = yield g
        .addV("User")
        .property(id, "user2")
        .property(single, "name", "Jane Doe")
        .property("age", 28)
        .next();
      yield g.V("user1").addE("knows").to(g.V("user2")).next();
      console.log("Added a friend relationship between user1 and user2");
      // Commit the transaction
      yield connection.close();
    } catch (error) {
      console.error("Failed to populate Neptune:", error);
    }
  });
}
main();

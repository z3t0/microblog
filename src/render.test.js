import { assertEquals } from "jsr:@std/assert";
import { _Testing } from "./render.ts";

const testPosts = [
  {"guid":"e25e94a0-4c70-47ce-b5d6-91489a9898f7","content":"test\n","tags":[""],"created_at":"2025-04-25 23:34:33"},
  {"guid":"d87a0e86-1fa0-4789-8df7-36117c09a8c3","content":"Ramblings on software complexity\r\n\r\n1. Why is software so complex? We have 100s of libraries for a small frontend application.\r\n2. Why is running software so complex? CPU, Memory, Networking, Operating Systems, Security, container runtimes, versions of everything, multiple databases, programming languages, integration of components, its a night mare.\r\n3. When did we decide it would be a good idea to make software larger than what an individual can keep in their head? Now we need 10 people to deploy and manage any software (service) \r\n4. Why do we prefer software to be a service rather than a product?","tags":[""],"created_at":"2025-04-25 15:30:14"},
  {"guid":"b0c6e295-152f-46e0-bd16-70f9acaee7a5","content":"Feeling haunted as an entrepreneur\r\n\r\n- Am I working on the right thing?\r\n- There's so much to do, I'll never manage.\r\n- All the sacrifices: friends, family, other hobbies, health.","tags":[""],"created_at":"2025-04-25 15:27:14"},
  {"guid":"310e8684-d1cf-4df4-9a30-1e526b9e781f","content":"It's important for people to have a purpose to strive towards.\r\n\r\nAlso we underestimate the significance of boredom. Not only is it an uncomfortable experience, and wasteful. But it typically goes hand in hand with a lack of purpose. \r\n\r\nThink of boredom as a litmus test for a deeper concern.","tags":[""],"created_at":"2025-04-25 15:26:05"},
  {"guid":"16344ca5-1a59-4365-999e-b65150dbe3e0","content":"If you want to make the world a better place, design better incentives.","tags":[""],"created_at":"2025-04-25 13:40:03"},
  {"guid":"235f3383-9511-41c9-b2e6-9862bd4c2527","content":"Massively reducing complexity is important for empowering more people on the internet. ","tags":[""],"created_at":"2025-04-25 13:30:05"},
  {"guid":"755413d5-e70e-41c7-821e-02a672b6e831","content":"One of the things that makes programming fun is the instant feedback, such as live reload, live coding in smalltalk /emacs and the intellisense from code editors","tags":[""],"created_at":"2025-04-25 12:32:00"},
  {"guid":"97e9ef7d-e0a1-4121-a776-2978cfc32e8b","content":"Dhh on merchants of complexity (eg k8s)\r\n\r\nhttps://youtu.be/tWduT9ygUQ4?si=s6sYydaJXAFRY76G","tags":[""],"created_at":"2025-04-25 12:31:01"},
  {"guid":"74e53f08-ef46-4116-9369-690ac3bbc5f2","content":"Day2","tags":[""],"created_at":"2025-04-24 02:02:16"},
  {"guid":"007351ce-38ca-4955-8f49-c552edd4729a","content":"Day3","tags":[""],"created_at":"2025-04-23 01:53:36"}]

Deno.test("groupPostsByDate", () => {
  assertEquals(testPosts.length, 10)

  const res = _Testing.groupPostsByDate(testPosts)

  assertEquals(Array.from(res.keys()).length, 3, "the 10 posts should be grouped into 3 days")
})
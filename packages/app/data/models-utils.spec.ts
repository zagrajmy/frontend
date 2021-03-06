import { expecter } from "ts-snippet";

import { noop } from "../src";
import { AgendaItem, Festival } from "./models-utils";

const expectSnippet = expecter(
  (code) => /* ts */ `
  import { ch_festival } from "./packages/app/data/graphql-zeus";
  import { AgendaItem, Festival } from "./packages/app/data/models-utils";

  ${code}
`,
  { strict: true, jsx: "react" }
);

describe("AgendaItem", () => {
  describe("matchStatus", () => {
    it("treats unknown value as `unassigned`", () => {
      expect(
        AgendaItem.matchStatus(
          {
            id: 0,
            status: "foobar",
          },
          {
            confirmed: (_) => null,
            unassigned: (b) => [b.status, true],
            unconfirmed: (_) => null,
          }
        )
      ).toStrictEqual(["unassigned", true]);
    });
  });
});

describe("Festival", () => {
  describe("matchStatus", () => {
    it("infers variable types", () => {
      const expected = expectSnippet(/* ts */ `
        const status: Festival.Status = "ongoing";

        const festival: Pick<ch_festival, "id" | "name" | "slug" | "status"> = {
          id: 0,
          name: "Online Boardgames Night",
          slug: "online_boardgames_night",
          status,
        };

        Festival.matchStatus(festival, {
          agenda: () => {},
          draft: () => {},
          ongoing: () => {},
          past: () => {},
          proposal: () => {},
          ready: (festival) => {
            const inferredStatus = festival.status;
            const inferredName = festival.name;
          },
        });
      `);

      expected.toSucceed();
      expected.toInfer("inferredStatus", '"ready"');
      expected.toInfer("inferredName", "string");
    });

    it("accepts subsets of Festival object properties", () => {
      const expected = expectSnippet(/* ts */ `
        const festival = {
          name: "Online Boardgames Night",
          status: "agenda",
          ch_rooms: [
            {
              name: "Common Room",
              ch_agenda_items: [
                { id: 1, helper_confirmed: true },
                { id: 2, helper_confirmed: true },
              ],
            },
            {
              name: "Tournament Room",
              ch_agenda_items: [
                { id: 3, helper_confirmed: true },
                { id: 4, helper_confirmed: true },
              ],
            },
          ],
        };

        Festival.matchStatus(festival, {
          agenda: () => {},
          draft: f => f.ch_rooms.map(r => {
            const room = r;
          }),
          ongoing: () => {},
          past: () => {},
          proposal: () => {},
          ready: () => {},
        });
      `);

      expected.toSucceed();
      expected.toInfer(
        "room",
        `{
           name: string;
           ch_agenda_items: {
             id: number;
             helper_confirmed: boolean;
           }[];
         }`
      );
    });
  });
});

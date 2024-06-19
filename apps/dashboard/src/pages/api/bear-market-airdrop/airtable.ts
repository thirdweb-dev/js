// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Airtable from "airtable";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name?: string;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;

  const base = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(
    process.env.AIRTABLE_PAGE_ID as string,
  );

  if (req.method !== "POST") {
    res.status(404).json({ message: "Invalid request method" });
  }

  const { email, address, optIn } = req.body;

  // Check if email is already in the database
  base("Table 1")
    .select({
      filterByFormula: `{Email} = "${email}"`,
    })
    .firstPage(function (err: any, records: any) {
      if (err) {
        console.error(err);
        return;
      }
      const found = records.length > 0;
      if (found) {
        res.status(401).json({ message: "Email already registered!" });
      } else {
        // Add email to the database
        base("Table 1").create(
          [
            {
              fields: {
                Email: email,
                Address: address,
                emailCampaign: optIn ? "true" : "false",
              },
            },
          ],
          function (_err: any) {
            if (_err) {
              console.error(_err);
              res.status(500).json({ message: "Error registering email" });
              return;
            }
          },
        );
        res.status(200).json({ message: "Email registered" });
      }
    });
}

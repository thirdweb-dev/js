# Add new tags
1. Go to ./data/templates/tags.ts
2. Add new items to `TEMPLATE_TAGS`
  2.1 Make sure the `id` is unique and in lowercase

# Add new templates
1. Go to ./data/templates/templates.ts
2. Add new items to `TEMPLATE_DATA`
  2.1 Each templates must have a public github repo.
      Should you (as an external contributor) want to contribute your own repo,
      we will fork it into our own GitHub org account (`thirdweb-example`) and
      give you proper credits. This is to ensure that the data will not be lost

# Help improve the tag and filter results
Each template has a `tags` and `keywords` properties. While they both represent "tagIds", there are differences:
1. `tags` are used in the UI (we display the tag badges on the template cards and pages)
  Tags should be limited to a few items to ensure a clean UI and proper category management.
2. `keywords` are used in the search bar and are not displayed any where. They can be added in large quantity to improve the search results.
  For example, if a template has the tag "nft-drop", it's almost always going to be related to the "ERC-721" and "NFT" keywords. So you can add the relevant tag ids ("nft", "erc721") to the `keywords` field of that template.
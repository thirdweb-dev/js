import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import TemplateWrapper from "../../components/templates/Wrapper";
import { TEMPLATE_DATA } from "data/templates/templates";

const title = "Web3 Templates for Websites & Apps";
const description =
  "Start building with a library of quick-start templates for web3 apps and websites — for NFTs, marketplaces, and more. Get started.";

const Templates: ThirdwebNextPage = () => {
  return (
    <TemplateWrapper
      title={title}
      description={description}
      data={TEMPLATE_DATA}
      showFilterMenu={true}
    />
  );
};

Templates.pageId = PageId.Templates;

export default Templates;

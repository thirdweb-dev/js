import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@thirdweb-dev/contracts/feature/PrimarySale.sol";

contract NFT is ERC721, PrimarySale {
    constructor() ERC721("NFT", "NFT") {

    }

    /// @dev Determine what wallet can update claim conditions
    function _canSetPrimarySaleRecipient() internal pure override returns (bool) {
        return true;
    }
}
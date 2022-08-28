const baseContracts = {
  ERC721Base: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract Contract is ERC721Base {

      constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    )
        ERC721Base(
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps
        )
    {}

}`,
  ERC721Signature: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721SignatureMint.sol";

contract Contract is ERC721SignatureMint {
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _primarySaleRecipient
    )
        ERC721SignatureMint(
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps,
            _primarySaleRecipient
        )
    {}
}`,
  ERC721LazyMint: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721LazyMint.sol";

contract Contract is ERC721LazyMint {
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC721LazyMint(_name, _symbol, _royaltyRecipient, _royaltyBps) {}
}`,
  ERC721DelayedReveal: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721DelayedReveal.sol";

contract Contract is ERC721DelayedReveal {
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC721DelayedReveal(_name, _symbol, _royaltyRecipient, _royaltyBps) {}
}`,
  ERC721Drop: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Drop.sol";

contract Contract is ERC721Drop {
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _primarySaleRecipient
    )
        ERC721Drop(
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps,
            _primarySaleRecipient
        )
    {}
}`,
  ERC1155Base: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC1155Base.sol";

contract Contract is ERC1155Base {

      constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    )
        ERC1155Base(
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps
        )
    {}

}`,
  ERC1155Signature: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC1155SignatureMint.sol";

contract Contract is ERC1155SignatureMint {
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _primarySaleRecipient
    )
        ERC1155SignatureMint(
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps,
            _primarySaleRecipient
        )
    {}
}`,
  ERC1155LazyMint: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC1155LazyMint.sol";

contract Contract is ERC1155LazyMint {
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC1155LazyMint(_name, _symbol, _royaltyRecipient, _royaltyBps) {}
}`,
  ERC1155DelayedReveal: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC1155DelayedReveal.sol";

contract Contract is ERC1155DelayedReveal {
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC1155DelayedReveal(_name, _symbol, _royaltyRecipient, _royaltyBps) {}
}`,
  ERC1155Drop: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC1155Drop.sol";

contract Contract is ERC1155Drop {
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _primarySaleRecipient
    )
        ERC1155Drop(
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps,
            _primarySaleRecipient
        )
    {}
}`,
  ERC20Base: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC20Base.sol";

contract Contract is ERC20Base {
      constructor(
        string memory _name,
        string memory _symbol
    )
        ERC20Base(
            _name,
            _symbol
        )
    {}
}`,
  ERC20Vote: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC20Vote.sol";

contract Contract is ERC20Vote {
      constructor(
        string memory _name,
        string memory _symbol
    )
        ERC20Vote(
            _name,
            _symbol
        )
    {}
}`,
  ERC20SignatureMint: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC20SignatureMint.sol";

contract Contract is ERC20SignatureMint {
      constructor(
        string memory _name,
        string memory _symbol,
        address _primarySaleRecipient
    )
        ERC20SignatureMint(
            _name,
            _symbol,
            _primarySaleRecipient
        )
    {}
}`,

  ERC20SignatureMintVote: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC20SignatureMintVote.sol";

contract Contract is ERC20SignatureMintVote {
      constructor(
        string memory _name,
        string memory _symbol,
        address _primarySaleRecipient
    )
        ERC20SignatureMintVote(
            _name,
            _symbol,
            _primarySaleRecipient
        )
    {}
}`,

  ERC20Drop: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC20Drop.sol";

contract Contract is ERC20Drop {
      constructor(
        string memory _name,
        string memory _symbol,
        address _primarySaleRecipient
    )
        ERC20Drop(
            _name,
            _symbol,
            _primarySaleRecipient
        )
    {}
}`,
  ERC20DropVote: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC20DropVote.sol";

contract Contract is ERC20DropVote {
      constructor(
        string memory _name,
        string memory _symbol,
        address _primarySaleRecipient
    )
        ERC20DropVote(
            _name,
            _symbol,
            _primarySaleRecipient
        )
    {}
}`,
};

export default baseContracts;

const baseContracts = {
  ERC721Base: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract Contract is ERC721Base {

      constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    )
        ERC721Base(
            _defaultAdmin,
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps
        )
    {}

}`,
  ERC721SignatureMint: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721SignatureMint.sol";

contract Contract is ERC721SignatureMint {
    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _primarySaleRecipient
    )
        ERC721SignatureMint(
            _defaultAdmin,
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
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC721LazyMint(_defaultAdmin, _name, _symbol, _royaltyRecipient, _royaltyBps) {}
}`,
  ERC721DelayedReveal: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721DelayedReveal.sol";

contract Contract is ERC721DelayedReveal {
    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC721DelayedReveal(_defaultAdmin, _name, _symbol, _royaltyRecipient, _royaltyBps) {}
}`,
  ERC721Drop: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Drop.sol";

contract Contract is ERC721Drop {
    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _primarySaleRecipient
    )
        ERC721Drop(
            _defaultAdmin,
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
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    )
        ERC1155Base(
            _defaultAdmin,
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps
        )
    {}

}`,
  Staking721Base: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/Staking721Base.sol";

contract Contract is Staking721Base {
      constructor(
        address _defaultAdmin,
        uint256 _timeUnit,
        uint256 _rewardsPerUnitTime,
        address _nftCollection,
        address _rewardToken,
        address _nativeTokenWrapper
    )
        Staking721Base(
            _defaultAdmin,
            _timeUnit,
            _rewardsPerUnitTime,
            _nftCollection,
            _rewardToken,
            _nativeTokenWrapper
        )
    {}
}`,
  ERC1155SignatureMint: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC1155SignatureMint.sol";

contract Contract is ERC1155SignatureMint {
    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _primarySaleRecipient
    )
        ERC1155SignatureMint(
            _defaultAdmin,
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
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC1155LazyMint(_defaultAdmin, _name, _symbol, _royaltyRecipient, _royaltyBps) {}
}`,
  ERC1155DelayedReveal: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC1155DelayedReveal.sol";

contract Contract is ERC1155DelayedReveal {
    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC1155DelayedReveal(_defaultAdmin, _name, _symbol, _royaltyRecipient, _royaltyBps) {}
}`,
  ERC1155Drop: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC1155Drop.sol";

contract Contract is ERC1155Drop {
    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _primarySaleRecipient
    )
        ERC1155Drop(
            _defaultAdmin,
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps,
            _primarySaleRecipient
        )
    {}
}`,
  Staking1155Base: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/Staking1155Base.sol";

contract Contract is Staking1155Base {
      constructor(
        address _defaultAdmin,
        uint256 _defaultTimeUnit,
        uint256 _defaultRewardsPerUnitTime,
        address _stakingToken,
        address _rewardToken,
        address _nativeTokenWrapper
    )
        Staking1155Base(
            _defaultAdmin,
            _defaultTimeUnit,
            _defaultRewardsPerUnitTime,
            _stakingToken,
            _rewardToken,
            _nativeTokenWrapper
        )
    {}
}`,
  ERC20Base: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC20Base.sol";

contract Contract is ERC20Base {
      constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol
    )
        ERC20Base(
            _defaultAdmin,
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
        address _defaultAdmin,
        string memory _name,
        string memory _symbol
    )
        ERC20Vote(
            _defaultAdmin,
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
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _primarySaleRecipient
    )
        ERC20SignatureMint(
            _defaultAdmin,
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
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _primarySaleRecipient
    )
        ERC20SignatureMintVote(
            _defaultAdmin,
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
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _primarySaleRecipient
    )
        ERC20Drop(
            _defaultAdmin,
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
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _primarySaleRecipient
    )
        ERC20DropVote(
            _defaultAdmin,
            _name,
            _symbol,
            _primarySaleRecipient
        )
    {}
}`,
  Staking20Base: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/Staking20Base.sol";

contract Contract is Staking20Base {
      constructor(
        address _defaultAdmin,
        uint256 _timeUnit,
        uint256 _rewardRatioNumerator,
        uint256 _rewardRatioDenominator,
        address _stakingToken,
        address _rewardToken,
        address _nativeTokenWrapper
    )
        Staking20Base(
            _defaultAdmin,
            _timeUnit,
            _rewardRatioNumerator,
            _rewardRatioDenominator,
            _stakingToken,
            _rewardToken,
            _nativeTokenWrapper
        )
    {}
}`,
};

export default baseContracts;

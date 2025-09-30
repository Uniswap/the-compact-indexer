export const TheCompactAbi = [
  {
    "type": "function",
    "name": "DOMAIN_SEPARATOR",
    "inputs": [],
    "outputs": [
      {
        "name": "domainSeparator",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "__benchmark",
    "inputs": [
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "__registerAllocator",
    "inputs": [
      {
        "name": "allocator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "proof",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "allocatorId",
        "type": "uint96",
        "internalType": "uint96"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "allocatedBatchTransfer",
    "inputs": [
      {
        "name": "transfer",
        "type": "tuple",
        "internalType": "struct AllocatedBatchTransfer",
        "components": [
          {
            "name": "allocatorData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "expires",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "transfers",
            "type": "tuple[]",
            "internalType": "struct ComponentsById[]",
            "components": [
              {
                "name": "id",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "portions",
                "type": "tuple[]",
                "internalType": "struct Component[]",
                "components": [
                  {
                    "name": "claimant",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "amount",
                    "type": "uint256",
                    "internalType": "uint256"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "allocatedTransfer",
    "inputs": [
      {
        "name": "transfer",
        "type": "tuple",
        "internalType": "struct AllocatedTransfer",
        "components": [
          {
            "name": "allocatorData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "expires",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "recipients",
            "type": "tuple[]",
            "internalType": "struct Component[]",
            "components": [
              {
                "name": "claimant",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "assignEmissary",
    "inputs": [
      {
        "name": "lockTag",
        "type": "bytes12",
        "internalType": "bytes12"
      },
      {
        "name": "emissary",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "batchDeposit",
    "inputs": [
      {
        "name": "idsAndAmounts",
        "type": "uint256[2][]",
        "internalType": "uint256[2][]"
      },
      {
        "name": "recipient",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "batchDepositAndRegisterFor",
    "inputs": [
      {
        "name": "recipient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "idsAndAmounts",
        "type": "uint256[2][]",
        "internalType": "uint256[2][]"
      },
      {
        "name": "arbiter",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "expires",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "typehash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "witness",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "claimHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "registeredAmounts",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "batchDepositAndRegisterMultiple",
    "inputs": [
      {
        "name": "idsAndAmounts",
        "type": "uint256[2][]",
        "internalType": "uint256[2][]"
      },
      {
        "name": "claimHashesAndTypehashes",
        "type": "bytes32[2][]",
        "internalType": "bytes32[2][]"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "batchDepositAndRegisterViaPermit2",
    "inputs": [
      {
        "name": "depositor",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "permitted",
        "type": "tuple[]",
        "internalType": "struct ISignatureTransfer.TokenPermissions[]",
        "components": [
          {
            "name": "token",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "details",
        "type": "tuple",
        "internalType": "struct DepositDetails",
        "components": [
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "deadline",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lockTag",
            "type": "bytes12",
            "internalType": "bytes12"
          }
        ]
      },
      {
        "name": "claimHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "compactCategory",
        "type": "uint8",
        "internalType": "enum CompactCategory"
      },
      {
        "name": "witness",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "ids",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "batchDepositViaPermit2",
    "inputs": [
      {
        "name": "depositor",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "permitted",
        "type": "tuple[]",
        "internalType": "struct ISignatureTransfer.TokenPermissions[]",
        "components": [
          {
            "name": "token",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "details",
        "type": "tuple",
        "internalType": "struct DepositDetails",
        "components": [
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "deadline",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lockTag",
            "type": "bytes12",
            "internalType": "bytes12"
          }
        ]
      },
      {
        "name": "recipient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "ids",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "consume",
    "inputs": [
      {
        "name": "nonces",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositERC20",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "lockTag",
        "type": "bytes12",
        "internalType": "bytes12"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "recipient",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositERC20AndRegister",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "lockTag",
        "type": "bytes12",
        "internalType": "bytes12"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "claimHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "typehash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositERC20AndRegisterFor",
    "inputs": [
      {
        "name": "recipient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "lockTag",
        "type": "bytes12",
        "internalType": "bytes12"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "arbiter",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "expires",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "typehash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "witness",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "claimHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "registeredAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositERC20AndRegisterViaPermit2",
    "inputs": [
      {
        "name": "permit",
        "type": "tuple",
        "internalType": "struct ISignatureTransfer.PermitTransferFrom",
        "components": [
          {
            "name": "permitted",
            "type": "tuple",
            "internalType": "struct ISignatureTransfer.TokenPermissions",
            "components": [
              {
                "name": "token",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "deadline",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "depositor",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "lockTag",
        "type": "bytes12",
        "internalType": "bytes12"
      },
      {
        "name": "claimHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "compactCategory",
        "type": "uint8",
        "internalType": "enum CompactCategory"
      },
      {
        "name": "witness",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositERC20ViaPermit2",
    "inputs": [
      {
        "name": "permit",
        "type": "tuple",
        "internalType": "struct ISignatureTransfer.PermitTransferFrom",
        "components": [
          {
            "name": "permitted",
            "type": "tuple",
            "internalType": "struct ISignatureTransfer.TokenPermissions",
            "components": [
              {
                "name": "token",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "deadline",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "depositor",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "lockTag",
        "type": "bytes12",
        "internalType": "bytes12"
      },
      {
        "name": "recipient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositNative",
    "inputs": [
      {
        "name": "lockTag",
        "type": "bytes12",
        "internalType": "bytes12"
      },
      {
        "name": "recipient",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "depositNativeAndRegister",
    "inputs": [
      {
        "name": "lockTag",
        "type": "bytes12",
        "internalType": "bytes12"
      },
      {
        "name": "claimHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "typehash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "depositNativeAndRegisterFor",
    "inputs": [
      {
        "name": "recipient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "lockTag",
        "type": "bytes12",
        "internalType": "bytes12"
      },
      {
        "name": "arbiter",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "expires",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "typehash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "witness",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "claimHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "disableForcedWithdrawal",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "enableForcedWithdrawal",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "withdrawableAt",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "forcedWithdrawal",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "recipient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getEmissaryStatus",
    "inputs": [
      {
        "name": "sponsor",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "lockTag",
        "type": "bytes12",
        "internalType": "bytes12"
      }
    ],
    "outputs": [
      {
        "name": "status",
        "type": "uint8",
        "internalType": "enum EmissaryStatus"
      },
      {
        "name": "emissaryAssignmentAvailableAt",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "currentEmissary",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getForcedWithdrawalStatus",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "status",
        "type": "uint8",
        "internalType": "enum ForcedWithdrawalStatus"
      },
      {
        "name": "forcedWithdrawalAvailableAt",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getLockDetails",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "allocator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "resetPeriod",
        "type": "uint8",
        "internalType": "enum ResetPeriod"
      },
      {
        "name": "scope",
        "type": "uint8",
        "internalType": "enum Scope"
      },
      {
        "name": "lockTag",
        "type": "bytes12",
        "internalType": "bytes12"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRequiredWithdrawalFallbackStipends",
    "inputs": [],
    "outputs": [
      {
        "name": "nativeTokenStipend",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "erc20TokenStipend",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasConsumedAllocatorNonce",
    "inputs": [
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "allocator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "consumed",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isRegistered",
    "inputs": [
      {
        "name": "sponsor",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "claimHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "typehash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "isActive",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "register",
    "inputs": [
      {
        "name": "claimHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "typehash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registerBatchFor",
    "inputs": [
      {
        "name": "typehash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "arbiter",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "sponsor",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "expires",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "idsAndAmountsHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "witness",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "sponsorSignature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "claimHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registerFor",
    "inputs": [
      {
        "name": "typehash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "arbiter",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "sponsor",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "expires",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "lockTag",
        "type": "bytes12",
        "internalType": "bytes12"
      },
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "witness",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "sponsorSignature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "claimHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registerMultichainFor",
    "inputs": [
      {
        "name": "typehash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "sponsor",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "expires",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "elementsHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "notarizedChainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "sponsorSignature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "claimHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registerMultiple",
    "inputs": [
      {
        "name": "claimHashesAndTypehashes",
        "type": "bytes32[2][]",
        "internalType": "bytes32[2][]"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "scheduleEmissaryAssignment",
    "inputs": [
      {
        "name": "lockTag",
        "type": "bytes12",
        "internalType": "bytes12"
      }
    ],
    "outputs": [
      {
        "name": "emissaryAssignmentAvailableAt",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AllocatorRegistered",
    "inputs": [
      {
        "name": "allocatorId",
        "type": "uint96",
        "indexed": false,
        "internalType": "uint96"
      },
      {
        "name": "allocator",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Claim",
    "inputs": [
      {
        "name": "sponsor",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "allocator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "arbiter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "claimHash",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CompactRegistered",
    "inputs": [
      {
        "name": "sponsor",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "claimHash",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "typehash",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EmissaryAssigned",
    "inputs": [
      {
        "name": "sponsor",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "lockTag",
        "type": "bytes12",
        "indexed": true,
        "internalType": "bytes12"
      },
      {
        "name": "emissary",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EmissaryAssignmentScheduled",
    "inputs": [
      {
        "name": "sponsor",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "lockTag",
        "type": "bytes12",
        "indexed": true,
        "internalType": "bytes12"
      },
      {
        "name": "assignableAt",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ForcedWithdrawalStatusUpdated",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "id",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "activating",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "withdrawableAt",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "NonceConsumedDirectly",
    "inputs": [
      {
        "name": "allocator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AllocatedAmountExceeded",
    "inputs": [
      {
        "name": "allocatedAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "providedAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ChainIndexOutOfRange",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EmissaryAssignmentUnavailable",
    "inputs": [
      {
        "name": "assignableAt",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "Expired",
    "inputs": [
      {
        "name": "expiration",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ForcedWithdrawalAlreadyDisabled",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ForcedWithdrawalFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InconsistentAllocators",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidAllocation",
    "inputs": [
      {
        "name": "allocator",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidBatchAllocation",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidBatchDepositStructure",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidDepositBalanceChange",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidDepositTokenOrdering",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidEmissaryAssignment",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidLockTag",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidRegistrationProof",
    "inputs": [
      {
        "name": "allocator",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidScope",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidToken",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "Permit2CallFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PrematureWithdrawal",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ReentrantCall",
    "inputs": [
      {
        "name": "existingCaller",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnallocatedTransfer",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  }
] as const;
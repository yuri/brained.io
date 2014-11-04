/* global exports */

exports.schemas = [{
  name: 'users',
  properties: {}
}, {
  name: 'userProviderAccounts',
  properties: {
    username: {
      type: String
    }, // Assigned by us
    provider: {
      type: String,
      enum: ['google', 'twitter', 'facebook'],
      required: true
    },
    idWithProvider: {
      type: String,
      required: true
    }, // Assigned by the provider
    emails: [{
      type: String
    }],
    displayName: {
      type: String
    },
    oauthToken: {
      type: String
    },
    oauthSecret: {
      type: String
    },
    tokenExpirationDate: {
      type: Date
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  }
}, {
  name: 'presentations',
  properties: {
    slug: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    owner: {
      type: String,
      required: true
    },
    editors: [{
      type: String
    }],
    screenshot: {
      type: String
    },
    description: {
      type: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    featured: {
      type: Boolean,
      default: false
    },
    published: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    slides: [{
      // waypoint: {
      //   type: String,
      //   required: true
      // },
      camera: {
        type: String,
        required: true
      },
      cameraPos: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      description: {
        type: String
      },
      aside: {
        data: [{
          type: {
            type: String,
            required: true
          },
          data: {
            text: {
              type: String
            },
            file: {
              url: {
                type: String
              }
            }
          }
        }]
      },
      highlights: [{
        regionName: {
          type: String,
          required: true
        },
        color: {
          type: String,
          required: true
        },
        opacity: {
          type: String,
         // required: true //not currently required in order to allow for pre-opacity presentations to be saved/updated
        },
        sides : {
          leftSelected: {
            type: Boolean,
            default: true
          },
          rightSelected: {
            type: Boolean,
            default: true
          }
        }
      }]
    }]
  }
}];
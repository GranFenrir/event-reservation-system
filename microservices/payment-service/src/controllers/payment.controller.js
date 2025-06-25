'use strict';
var __runInitializers =
  (this && this.__runInitializers) ||
  function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
      value = useValue
        ? initializers[i].call(thisArg, value)
        : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
  };
var __esDecorate =
  (this && this.__esDecorate) ||
  function (
    ctor,
    descriptorIn,
    decorators,
    contextIn,
    initializers,
    extraInitializers
  ) {
    function accept(f) {
      if (f !== void 0 && typeof f !== 'function')
        throw new TypeError('Function expected');
      return f;
    }
    var kind = contextIn.kind,
      key = kind === 'getter' ? 'get' : kind === 'setter' ? 'set' : 'value';
    var target =
      !descriptorIn && ctor
        ? contextIn['static']
          ? ctor
          : ctor.prototype
        : null;
    var descriptor =
      descriptorIn ||
      (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _,
      done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === 'access' ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) {
        if (done)
          throw new TypeError(
            'Cannot add initializers after decoration has completed'
          );
        extraInitializers.push(accept(f || null));
      };
      var result = (0, decorators[i])(
        kind === 'accessor'
          ? { get: descriptor.get, set: descriptor.set }
          : descriptor[key],
        context
      );
      if (kind === 'accessor') {
        if (result === void 0) continue;
        if (result === null || typeof result !== 'object')
          throw new TypeError('Object expected');
        if ((_ = accept(result.get))) descriptor.get = _;
        if ((_ = accept(result.set))) descriptor.set = _;
        if ((_ = accept(result.init))) initializers.unshift(_);
      } else if ((_ = accept(result))) {
        if (kind === 'field') initializers.unshift(_);
        else descriptor[key] = _;
      }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === 'function' ? Iterator : Object).prototype
      );
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __setFunctionName =
  (this && this.__setFunctionName) ||
  function (f, name, prefix) {
    if (typeof name === 'symbol')
      name = name.description ? '['.concat(name.description, ']') : '';
    return Object.defineProperty(f, 'name', {
      configurable: true,
      value: prefix ? ''.concat(prefix, ' ', name) : name,
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.PaymentController = void 0;
var common_1 = require('@nestjs/common');
var microservices_1 = require('@nestjs/microservices');
var PaymentController = (function () {
  var _classDecorators = [
    (0, common_1.Controller)('payments'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
  ];
  var _classDescriptor;
  var _classExtraInitializers = [];
  var _classThis;
  var _instanceExtraInitializers = [];
  var _create_decorators;
  var _findAll_decorators;
  var _findOne_decorators;
  var _findByReservation_decorators;
  var _findByUser_decorators;
  var _process_decorators;
  var _refund_decorators;
  var _update_decorators;
  var _remove_decorators;
  var _createPaymentMethod_decorators;
  var _findPaymentMethodsByUser_decorators;
  var _updatePaymentMethod_decorators;
  var _removePaymentMethod_decorators;
  var _handleStripeWebhook_decorators;
  var _getPayment_decorators;
  var _getPaymentsByUser_decorators;
  var _getPaymentsByReservation_decorators;
  var _createPayment_decorators;
  var _processPayment_decorators;
  var _refundPayment_decorators;
  var _handleReservationCreated_decorators;
  var _handleReservationCancelled_decorators;
  var _handleReservationExpired_decorators;
  var PaymentController = (_classThis = /** @class */ (function () {
    function PaymentController_1(paymentService, stripeService) {
      this.paymentService =
        (__runInitializers(this, _instanceExtraInitializers), paymentService);
      this.stripeService = stripeService;
    }
    PaymentController_1.prototype.create = function (createPaymentDto) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, this.paymentService.create(createPaymentDto)];
        });
      });
    };
    PaymentController_1.prototype.findAll = function (query) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, this.paymentService.findAll(query)];
        });
      });
    };
    PaymentController_1.prototype.findOne = function (id) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, this.paymentService.findOne(id)];
        });
      });
    };
    PaymentController_1.prototype.findByReservation = function (reservationId) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [
            2 /*return*/,
            this.paymentService.findByReservation(reservationId),
          ];
        });
      });
    };
    PaymentController_1.prototype.findByUser = function (userId) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, this.paymentService.findByUser(userId)];
        });
      });
    };
    PaymentController_1.prototype.process = function (processPaymentDto) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, this.paymentService.process(processPaymentDto)];
        });
      });
    };
    PaymentController_1.prototype.refund = function (refundPaymentDto) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, this.paymentService.refund(refundPaymentDto)];
        });
      });
    };
    PaymentController_1.prototype.update = function (id, updatePaymentDto) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [
            2 /*return*/,
            this.paymentService.update(id, updatePaymentDto),
          ];
        });
      });
    };
    PaymentController_1.prototype.remove = function (id) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, this.paymentService.remove(id)];
        });
      });
    };
    // Payment Methods endpoints
    PaymentController_1.prototype.createPaymentMethod = function (
      createPaymentMethodDto
    ) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [
            2 /*return*/,
            this.paymentService.createPaymentMethod(createPaymentMethodDto),
          ];
        });
      });
    };
    PaymentController_1.prototype.findPaymentMethodsByUser = function (userId) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [
            2 /*return*/,
            this.paymentService.findPaymentMethodsByUser(userId),
          ];
        });
      });
    };
    PaymentController_1.prototype.updatePaymentMethod = function (
      id,
      updatePaymentMethodDto
    ) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [
            2 /*return*/,
            this.paymentService.updatePaymentMethod(id, updatePaymentMethodDto),
          ];
        });
      });
    };
    PaymentController_1.prototype.removePaymentMethod = function (id) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, this.paymentService.removePaymentMethod(id)];
        });
      });
    };
    // Stripe webhook endpoint
    PaymentController_1.prototype.handleStripeWebhook = function (
      signature,
      payload
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var event_1, error_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, , 3]);
              return [
                4 /*yield*/,
                this.stripeService.handleWebhook(payload, signature),
              ];
            case 1:
              event_1 = _a.sent();
              // Handle different webhook events
              switch (event_1.type) {
                case 'payment_intent.succeeded':
                  // Handle successful payment
                  console.log('Payment succeeded:', event_1.data.object);
                  break;
                case 'payment_intent.payment_failed':
                  // Handle failed payment
                  console.log('Payment failed:', event_1.data.object);
                  break;
                case 'charge.dispute.created':
                  // Handle chargeback
                  console.log('Chargeback created:', event_1.data.object);
                  break;
                default:
                  console.log('Unhandled event type:', event_1.type);
              }
              return [2 /*return*/, { received: true }];
            case 2:
              error_1 = _a.sent();
              console.error('Webhook error:', error_1.message);
              throw error_1;
            case 3:
              return [2 /*return*/];
          }
        });
      });
    };
    // Kafka message handlers
    PaymentController_1.prototype.getPayment = function (data) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, this.paymentService.findOne(data.id)];
        });
      });
    };
    PaymentController_1.prototype.getPaymentsByUser = function (data) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, this.paymentService.findByUser(data.userId)];
        });
      });
    };
    PaymentController_1.prototype.getPaymentsByReservation = function (data) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [
            2 /*return*/,
            this.paymentService.findByReservation(data.reservationId),
          ];
        });
      });
    };
    PaymentController_1.prototype.createPayment = function (data) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, this.paymentService.create(data)];
        });
      });
    };
    PaymentController_1.prototype.processPayment = function (data) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, this.paymentService.process(data)];
        });
      });
    };
    PaymentController_1.prototype.refundPayment = function (data) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, this.paymentService.refund(data)];
        });
      });
    };
    PaymentController_1.prototype.handleReservationCreated = function (data) {
      return __awaiter(this, void 0, void 0, function () {
        var payment;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                this.paymentService.create({
                  reservationId: data.reservationId,
                  userId: data.userId,
                  eventId: data.eventId,
                  amount: data.totalAmount,
                  type: 'card', // Default to card payment
                  notes: 'Auto-created for reservation',
                }),
              ];
            case 1:
              payment = _a.sent();
              console.log('Payment created for reservation:', payment.id);
              return [2 /*return*/];
          }
        });
      });
    };
    PaymentController_1.prototype.handleReservationCancelled = function (data) {
      return __awaiter(this, void 0, void 0, function () {
        var payments, _i, payments_1, payment;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                this.paymentService.findByReservation(data.reservationId),
              ];
            case 1:
              payments = _a.sent();
              (_i = 0), (payments_1 = payments);
              _a.label = 2;
            case 2:
              if (!(_i < payments_1.length)) return [3 /*break*/, 5];
              payment = payments_1[_i];
              if (!(payment.isSuccessful && payment.remainingAmount > 0))
                return [3 /*break*/, 4];
              return [
                4 /*yield*/,
                this.paymentService.refund({
                  paymentId: payment.id,
                  reason: 'Reservation cancelled: '.concat(data.reason),
                }),
              ];
            case 3:
              _a.sent();
              _a.label = 4;
            case 4:
              _i++;
              return [3 /*break*/, 2];
            case 5:
              return [2 /*return*/];
          }
        });
      });
    };
    PaymentController_1.prototype.handleReservationExpired = function (data) {
      return __awaiter(this, void 0, void 0, function () {
        var payments, _i, payments_2, payment;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                this.paymentService.findByReservation(data.reservationId),
              ];
            case 1:
              payments = _a.sent();
              (_i = 0), (payments_2 = payments);
              _a.label = 2;
            case 2:
              if (!(_i < payments_2.length)) return [3 /*break*/, 5];
              payment = payments_2[_i];
              if (!payment.isPending) return [3 /*break*/, 4];
              return [
                4 /*yield*/,
                this.paymentService.update(payment.id, {
                  status: 'failed',
                  failureReason: 'Reservation expired',
                }),
              ];
            case 3:
              _a.sent();
              _a.label = 4;
            case 4:
              _i++;
              return [3 /*break*/, 2];
            case 5:
              return [2 /*return*/];
          }
        });
      });
    };
    return PaymentController_1;
  })());
  __setFunctionName(_classThis, 'PaymentController');
  (function () {
    var _metadata =
      typeof Symbol === 'function' && Symbol.metadata
        ? Object.create(null)
        : void 0;
    _create_decorators = [(0, common_1.Post)()];
    _findAll_decorators = [(0, common_1.Get)()];
    _findOne_decorators = [(0, common_1.Get)(':id')];
    _findByReservation_decorators = [
      (0, common_1.Get)('reservation/:reservationId'),
    ];
    _findByUser_decorators = [(0, common_1.Get)('user/:userId')];
    _process_decorators = [(0, common_1.Post)('process')];
    _refund_decorators = [(0, common_1.Post)('refund')];
    _update_decorators = [(0, common_1.Patch)(':id')];
    _remove_decorators = [(0, common_1.Delete)(':id')];
    _createPaymentMethod_decorators = [(0, common_1.Post)('methods')];
    _findPaymentMethodsByUser_decorators = [
      (0, common_1.Get)('methods/user/:userId'),
    ];
    _updatePaymentMethod_decorators = [(0, common_1.Patch)('methods/:id')];
    _removePaymentMethod_decorators = [(0, common_1.Delete)('methods/:id')];
    _handleStripeWebhook_decorators = [(0, common_1.Post)('webhook/stripe')];
    _getPayment_decorators = [
      (0, microservices_1.MessagePattern)('payment.get'),
    ];
    _getPaymentsByUser_decorators = [
      (0, microservices_1.MessagePattern)('payment.getByUser'),
    ];
    _getPaymentsByReservation_decorators = [
      (0, microservices_1.MessagePattern)('payment.getByReservation'),
    ];
    _createPayment_decorators = [
      (0, microservices_1.MessagePattern)('payment.create'),
    ];
    _processPayment_decorators = [
      (0, microservices_1.MessagePattern)('payment.process'),
    ];
    _refundPayment_decorators = [
      (0, microservices_1.MessagePattern)('payment.refund'),
    ];
    _handleReservationCreated_decorators = [
      (0, microservices_1.EventPattern)('reservation.created'),
    ];
    _handleReservationCancelled_decorators = [
      (0, microservices_1.EventPattern)('reservation.cancelled'),
    ];
    _handleReservationExpired_decorators = [
      (0, microservices_1.EventPattern)('reservation.expired'),
    ];
    __esDecorate(
      _classThis,
      null,
      _create_decorators,
      {
        kind: 'method',
        name: 'create',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'create' in obj;
          },
          get: function (obj) {
            return obj.create;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _findAll_decorators,
      {
        kind: 'method',
        name: 'findAll',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'findAll' in obj;
          },
          get: function (obj) {
            return obj.findAll;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _findOne_decorators,
      {
        kind: 'method',
        name: 'findOne',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'findOne' in obj;
          },
          get: function (obj) {
            return obj.findOne;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _findByReservation_decorators,
      {
        kind: 'method',
        name: 'findByReservation',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'findByReservation' in obj;
          },
          get: function (obj) {
            return obj.findByReservation;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _findByUser_decorators,
      {
        kind: 'method',
        name: 'findByUser',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'findByUser' in obj;
          },
          get: function (obj) {
            return obj.findByUser;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _process_decorators,
      {
        kind: 'method',
        name: 'process',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'process' in obj;
          },
          get: function (obj) {
            return obj.process;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _refund_decorators,
      {
        kind: 'method',
        name: 'refund',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'refund' in obj;
          },
          get: function (obj) {
            return obj.refund;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _update_decorators,
      {
        kind: 'method',
        name: 'update',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'update' in obj;
          },
          get: function (obj) {
            return obj.update;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _remove_decorators,
      {
        kind: 'method',
        name: 'remove',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'remove' in obj;
          },
          get: function (obj) {
            return obj.remove;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _createPaymentMethod_decorators,
      {
        kind: 'method',
        name: 'createPaymentMethod',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'createPaymentMethod' in obj;
          },
          get: function (obj) {
            return obj.createPaymentMethod;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _findPaymentMethodsByUser_decorators,
      {
        kind: 'method',
        name: 'findPaymentMethodsByUser',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'findPaymentMethodsByUser' in obj;
          },
          get: function (obj) {
            return obj.findPaymentMethodsByUser;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _updatePaymentMethod_decorators,
      {
        kind: 'method',
        name: 'updatePaymentMethod',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'updatePaymentMethod' in obj;
          },
          get: function (obj) {
            return obj.updatePaymentMethod;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _removePaymentMethod_decorators,
      {
        kind: 'method',
        name: 'removePaymentMethod',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'removePaymentMethod' in obj;
          },
          get: function (obj) {
            return obj.removePaymentMethod;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _handleStripeWebhook_decorators,
      {
        kind: 'method',
        name: 'handleStripeWebhook',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'handleStripeWebhook' in obj;
          },
          get: function (obj) {
            return obj.handleStripeWebhook;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _getPayment_decorators,
      {
        kind: 'method',
        name: 'getPayment',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'getPayment' in obj;
          },
          get: function (obj) {
            return obj.getPayment;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _getPaymentsByUser_decorators,
      {
        kind: 'method',
        name: 'getPaymentsByUser',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'getPaymentsByUser' in obj;
          },
          get: function (obj) {
            return obj.getPaymentsByUser;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _getPaymentsByReservation_decorators,
      {
        kind: 'method',
        name: 'getPaymentsByReservation',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'getPaymentsByReservation' in obj;
          },
          get: function (obj) {
            return obj.getPaymentsByReservation;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _createPayment_decorators,
      {
        kind: 'method',
        name: 'createPayment',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'createPayment' in obj;
          },
          get: function (obj) {
            return obj.createPayment;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _processPayment_decorators,
      {
        kind: 'method',
        name: 'processPayment',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'processPayment' in obj;
          },
          get: function (obj) {
            return obj.processPayment;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _refundPayment_decorators,
      {
        kind: 'method',
        name: 'refundPayment',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'refundPayment' in obj;
          },
          get: function (obj) {
            return obj.refundPayment;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _handleReservationCreated_decorators,
      {
        kind: 'method',
        name: 'handleReservationCreated',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'handleReservationCreated' in obj;
          },
          get: function (obj) {
            return obj.handleReservationCreated;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _handleReservationCancelled_decorators,
      {
        kind: 'method',
        name: 'handleReservationCancelled',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'handleReservationCancelled' in obj;
          },
          get: function (obj) {
            return obj.handleReservationCancelled;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      _classThis,
      null,
      _handleReservationExpired_decorators,
      {
        kind: 'method',
        name: 'handleReservationExpired',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'handleReservationExpired' in obj;
          },
          get: function (obj) {
            return obj.handleReservationExpired;
          },
        },
        metadata: _metadata,
      },
      null,
      _instanceExtraInitializers
    );
    __esDecorate(
      null,
      (_classDescriptor = { value: _classThis }),
      _classDecorators,
      { kind: 'class', name: _classThis.name, metadata: _metadata },
      null,
      _classExtraInitializers
    );
    PaymentController = _classThis = _classDescriptor.value;
    if (_metadata)
      Object.defineProperty(_classThis, Symbol.metadata, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _metadata,
      });
    __runInitializers(_classThis, _classExtraInitializers);
  })();
  return (PaymentController = _classThis);
})();
exports.PaymentController = PaymentController;

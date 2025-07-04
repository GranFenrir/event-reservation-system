'use strict';
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
exports.StripeService = void 0;
var common_1 = require('@nestjs/common');
var stripe_1 = require('stripe');
var StripeService = (function () {
  var _classDecorators = [(0, common_1.Injectable)()];
  var _classDescriptor;
  var _classExtraInitializers = [];
  var _classThis;
  var StripeService = (_classThis = /** @class */ (function () {
    function StripeService_1(configService) {
      this.configService = configService;
      this.stripe = new stripe_1.default(
        this.configService.get('STRIPE_SECRET_KEY'),
        {
          apiVersion: '2024-06-20',
        }
      );
    }
    StripeService_1.prototype.processPayment = function (data) {
      return __awaiter(this, void 0, void 0, function () {
        var paymentIntent, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
          switch (_c.label) {
            case 0:
              _c.trys.push([0, 2, , 3]);
              return [
                4 /*yield*/,
                this.stripe.paymentIntents.create({
                  amount: data.amount,
                  currency: data.currency,
                  payment_method: data.paymentMethodId,
                  confirm: true,
                  automatic_payment_methods: {
                    enabled: true,
                    allow_redirects: 'never',
                  },
                  metadata: {
                    reservationId: data.reservationId,
                    userId: data.userId,
                  },
                }),
              ];
            case 1:
              paymentIntent = _c.sent();
              return [
                2 /*return*/,
                {
                  paymentIntentId: paymentIntent.id,
                  chargeId:
                    (_b =
                      (_a = paymentIntent.charges) === null || _a === void 0
                        ? void 0
                        : _a.data[0]) === null || _b === void 0
                      ? void 0
                      : _b.id,
                  status: paymentIntent.status,
                },
              ];
            case 2:
              error_1 = _c.sent();
              throw new Error(
                'Stripe payment failed: '.concat(error_1.message)
              );
            case 3:
              return [2 /*return*/];
          }
        });
      });
    };
    StripeService_1.prototype.processRefund = function (data) {
      return __awaiter(this, void 0, void 0, function () {
        var refund, error_2;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, , 3]);
              return [
                4 /*yield*/,
                this.stripe.refunds.create({
                  charge: data.chargeId,
                  amount: data.amount,
                  reason: data.reason,
                }),
              ];
            case 1:
              refund = _a.sent();
              return [2 /*return*/, refund];
            case 2:
              error_2 = _a.sent();
              throw new Error('Stripe refund failed: '.concat(error_2.message));
            case 3:
              return [2 /*return*/];
          }
        });
      });
    };
    StripeService_1.prototype.createPaymentMethod = function (data) {
      return __awaiter(this, void 0, void 0, function () {
        var paymentMethod, error_3;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, , 3]);
              return [4 /*yield*/, this.stripe.paymentMethods.create(data)];
            case 1:
              paymentMethod = _a.sent();
              return [2 /*return*/, paymentMethod];
            case 2:
              error_3 = _a.sent();
              throw new Error(
                'Failed to create payment method: '.concat(error_3.message)
              );
            case 3:
              return [2 /*return*/];
          }
        });
      });
    };
    StripeService_1.prototype.createCustomer = function (data) {
      return __awaiter(this, void 0, void 0, function () {
        var customer, error_4;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, , 3]);
              return [4 /*yield*/, this.stripe.customers.create(data)];
            case 1:
              customer = _a.sent();
              return [2 /*return*/, customer];
            case 2:
              error_4 = _a.sent();
              throw new Error(
                'Failed to create customer: '.concat(error_4.message)
              );
            case 3:
              return [2 /*return*/];
          }
        });
      });
    };
    StripeService_1.prototype.attachPaymentMethodToCustomer = function (
      paymentMethodId,
      customerId
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var paymentMethod, error_5;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, , 3]);
              return [
                4 /*yield*/,
                this.stripe.paymentMethods.attach(paymentMethodId, {
                  customer: customerId,
                }),
              ];
            case 1:
              paymentMethod = _a.sent();
              return [2 /*return*/, paymentMethod];
            case 2:
              error_5 = _a.sent();
              throw new Error(
                'Failed to attach payment method: '.concat(error_5.message)
              );
            case 3:
              return [2 /*return*/];
          }
        });
      });
    };
    StripeService_1.prototype.detachPaymentMethod = function (paymentMethodId) {
      return __awaiter(this, void 0, void 0, function () {
        var paymentMethod, error_6;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, , 3]);
              return [
                4 /*yield*/,
                this.stripe.paymentMethods.detach(paymentMethodId),
              ];
            case 1:
              paymentMethod = _a.sent();
              return [2 /*return*/, paymentMethod];
            case 2:
              error_6 = _a.sent();
              throw new Error(
                'Failed to detach payment method: '.concat(error_6.message)
              );
            case 3:
              return [2 /*return*/];
          }
        });
      });
    };
    StripeService_1.prototype.retrievePaymentIntent = function (
      paymentIntentId
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var paymentIntent, error_7;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, , 3]);
              return [
                4 /*yield*/,
                this.stripe.paymentIntents.retrieve(paymentIntentId),
              ];
            case 1:
              paymentIntent = _a.sent();
              return [2 /*return*/, paymentIntent];
            case 2:
              error_7 = _a.sent();
              throw new Error(
                'Failed to retrieve payment intent: '.concat(error_7.message)
              );
            case 3:
              return [2 /*return*/];
          }
        });
      });
    };
    StripeService_1.prototype.handleWebhook = function (payload, signature) {
      return __awaiter(this, void 0, void 0, function () {
        var webhookSecret, event_1;
        return __generator(this, function (_a) {
          try {
            webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
            event_1 = this.stripe.webhooks.constructEvent(
              payload,
              signature,
              webhookSecret
            );
            return [2 /*return*/, event_1];
          } catch (error) {
            throw new Error(
              'Webhook signature verification failed: '.concat(error.message)
            );
          }
          return [2 /*return*/];
        });
      });
    };
    return StripeService_1;
  })());
  __setFunctionName(_classThis, 'StripeService');
  (function () {
    var _metadata =
      typeof Symbol === 'function' && Symbol.metadata
        ? Object.create(null)
        : void 0;
    __esDecorate(
      null,
      (_classDescriptor = { value: _classThis }),
      _classDecorators,
      { kind: 'class', name: _classThis.name, metadata: _metadata },
      null,
      _classExtraInitializers
    );
    StripeService = _classThis = _classDescriptor.value;
    if (_metadata)
      Object.defineProperty(_classThis, Symbol.metadata, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _metadata,
      });
    __runInitializers(_classThis, _classExtraInitializers);
  })();
  return (StripeService = _classThis);
})();
exports.StripeService = StripeService;

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
exports.PaymentService = void 0;
var common_1 = require('@nestjs/common');
var shared_1 = require('@event-reservation/shared');
var PaymentService = (function () {
  var _classDecorators = [(0, common_1.Injectable)()];
  var _classDescriptor;
  var _classExtraInitializers = [];
  var _classThis;
  var PaymentService = (_classThis = /** @class */ (function () {
    function PaymentService_1(
      paymentRepository,
      paymentMethodRepository,
      refundRepository,
      kafkaClient,
      configService,
      stripeService
    ) {
      this.paymentRepository = paymentRepository;
      this.paymentMethodRepository = paymentMethodRepository;
      this.refundRepository = refundRepository;
      this.kafkaClient = kafkaClient;
      this.configService = configService;
      this.stripeService = stripeService;
    }
    PaymentService_1.prototype.create = function (createPaymentDto) {
      return __awaiter(this, void 0, void 0, function () {
        var payment, savedPayment;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              payment = this.paymentRepository.create({
                reservationId: createPaymentDto.reservationId,
                userId: createPaymentDto.userId,
                eventId: createPaymentDto.eventId,
                amount: createPaymentDto.amount,
                currency: createPaymentDto.currency || 'USD',
                type: createPaymentDto.type,
                paymentMethodId: createPaymentDto.paymentMethodId,
                notes: createPaymentDto.notes,
                metadata: createPaymentDto.metadata,
                status: shared_1.PaymentStatus.PENDING,
              });
              return [4 /*yield*/, this.paymentRepository.save(payment)];
            case 1:
              savedPayment = _a.sent();
              // Emit payment created event
              this.kafkaClient.emit('payment.created', {
                paymentId: savedPayment.id,
                reservationId: savedPayment.reservationId,
                userId: savedPayment.userId,
                eventId: savedPayment.eventId,
                amount: savedPayment.amount,
                currency: savedPayment.currency,
              });
              return [2 /*return*/, savedPayment];
          }
        });
      });
    };
    PaymentService_1.prototype.findAll = function (query) {
      return __awaiter(this, void 0, void 0, function () {
        var page, limit, skip, queryBuilder, _a, payments, total;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              page = query.page || 1;
              limit = query.limit || 10;
              skip = (page - 1) * limit;
              queryBuilder = this.paymentRepository
                .createQueryBuilder('payment')
                .leftJoinAndSelect('payment.paymentMethod', 'paymentMethod')
                .leftJoinAndSelect('payment.refunds', 'refunds');
              if (query.userId) {
                queryBuilder.andWhere('payment.userId = :userId', {
                  userId: query.userId,
                });
              }
              if (query.eventId) {
                queryBuilder.andWhere('payment.eventId = :eventId', {
                  eventId: query.eventId,
                });
              }
              if (query.reservationId) {
                queryBuilder.andWhere(
                  'payment.reservationId = :reservationId',
                  {
                    reservationId: query.reservationId,
                  }
                );
              }
              if (query.status) {
                queryBuilder.andWhere('payment.status = :status', {
                  status: query.status,
                });
              }
              if (query.type) {
                queryBuilder.andWhere('payment.type = :type', {
                  type: query.type,
                });
              }
              if (query.from) {
                queryBuilder.andWhere('payment.createdAt >= :from', {
                  from: query.from,
                });
              }
              if (query.to) {
                queryBuilder.andWhere('payment.createdAt <= :to', {
                  to: query.to,
                });
              }
              return [
                4 /*yield*/,
                queryBuilder
                  .orderBy('payment.createdAt', 'DESC')
                  .skip(skip)
                  .take(limit)
                  .getManyAndCount(),
              ];
            case 1:
              (_a = _b.sent()), (payments = _a[0]), (total = _a[1]);
              return [
                2 /*return*/,
                { payments: payments, total: total, page: page, limit: limit },
              ];
          }
        });
      });
    };
    PaymentService_1.prototype.findOne = function (id) {
      return __awaiter(this, void 0, void 0, function () {
        var payment;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                this.paymentRepository.findOne({
                  where: { id: id },
                  relations: ['paymentMethod', 'refunds'],
                }),
              ];
            case 1:
              payment = _a.sent();
              if (!payment) {
                throw new common_1.NotFoundException('Payment not found');
              }
              return [2 /*return*/, payment];
          }
        });
      });
    };
    PaymentService_1.prototype.findByReservation = function (reservationId) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [
            2 /*return*/,
            this.paymentRepository.find({
              where: { reservationId: reservationId },
              relations: ['paymentMethod', 'refunds'],
              order: { createdAt: 'DESC' },
            }),
          ];
        });
      });
    };
    PaymentService_1.prototype.findByUser = function (userId) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [
            2 /*return*/,
            this.paymentRepository.find({
              where: { userId: userId },
              relations: ['paymentMethod', 'refunds'],
              order: { createdAt: 'DESC' },
            }),
          ];
        });
      });
    };
    PaymentService_1.prototype.process = function (processPaymentDto) {
      return __awaiter(this, void 0, void 0, function () {
        var payment, stripeResult, updatedPayment, error_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, this.findOne(processPaymentDto.paymentId)];
            case 1:
              payment = _a.sent();
              if (payment.status !== shared_1.PaymentStatus.PENDING) {
                throw new common_1.BadRequestException(
                  'Payment is not in pending status'
                );
              }
              _a.label = 2;
            case 2:
              _a.trys.push([2, 10, , 12]);
              // Update payment status to processing
              return [
                4 /*yield*/,
                this.paymentRepository.update(payment.id, {
                  status: shared_1.PaymentStatus.PROCESSING,
                }),
              ];
            case 3:
              // Update payment status to processing
              _a.sent();
              stripeResult = void 0;
              if (!(payment.type === shared_1.PaymentType.CARD))
                return [3 /*break*/, 6];
              return [
                4 /*yield*/,
                this.stripeService.processPayment({
                  amount: Number(payment.amount * 100), // Convert to cents
                  currency: payment.currency.toLowerCase(),
                  paymentMethodId: processPaymentDto.paymentMethodId,
                  reservationId: payment.reservationId,
                  userId: payment.userId,
                }),
              ];
            case 4:
              // Process card payment with Stripe
              stripeResult = _a.sent();
              return [
                4 /*yield*/,
                this.paymentRepository.update(payment.id, {
                  status: shared_1.PaymentStatus.COMPLETED,
                  stripePaymentIntentId: stripeResult.paymentIntentId,
                  stripeChargeId: stripeResult.chargeId,
                  processedAt: new Date(),
                }),
              ];
            case 5:
              _a.sent();
              return [3 /*break*/, 8];
            case 6:
              // Handle other payment types (future implementation)
              return [
                4 /*yield*/,
                this.paymentRepository.update(payment.id, {
                  status: shared_1.PaymentStatus.COMPLETED,
                  processedAt: new Date(),
                }),
              ];
            case 7:
              // Handle other payment types (future implementation)
              _a.sent();
              _a.label = 8;
            case 8:
              return [4 /*yield*/, this.findOne(payment.id)];
            case 9:
              updatedPayment = _a.sent();
              // Emit payment completed event
              this.kafkaClient.emit('payment.completed', {
                paymentId: updatedPayment.id,
                reservationId: updatedPayment.reservationId,
                status: 'success',
                amount: updatedPayment.amount,
                currency: updatedPayment.currency,
              });
              return [2 /*return*/, updatedPayment];
            case 10:
              error_1 = _a.sent();
              // Update payment status to failed
              return [
                4 /*yield*/,
                this.paymentRepository.update(payment.id, {
                  status: shared_1.PaymentStatus.FAILED,
                  failedAt: new Date(),
                  failureReason: error_1.message,
                }),
              ];
            case 11:
              // Update payment status to failed
              _a.sent();
              // Emit payment failed event
              this.kafkaClient.emit('payment.failed', {
                paymentId: payment.id,
                reservationId: payment.reservationId,
                reason: error_1.message,
              });
              throw error_1;
            case 12:
              return [2 /*return*/];
          }
        });
      });
    };
    PaymentService_1.prototype.refund = function (refundPaymentDto) {
      return __awaiter(this, void 0, void 0, function () {
        var payment, refundAmount, refund, savedRefund, stripeRefund, error_2;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, this.findOne(refundPaymentDto.paymentId)];
            case 1:
              payment = _a.sent();
              if (payment.status !== shared_1.PaymentStatus.COMPLETED) {
                throw new common_1.BadRequestException(
                  'Payment must be completed to process refund'
                );
              }
              refundAmount = refundPaymentDto.amount || Number(payment.amount);
              if (refundAmount > payment.remainingAmount) {
                throw new common_1.BadRequestException(
                  'Refund amount exceeds remaining payment amount'
                );
              }
              refund = this.refundRepository.create({
                paymentId: payment.id,
                amount: refundAmount,
                currency: payment.currency,
                reason: refundPaymentDto.reason,
                status: shared_1.RefundStatus.PENDING,
              });
              return [4 /*yield*/, this.refundRepository.save(refund)];
            case 2:
              savedRefund = _a.sent();
              _a.label = 3;
            case 3:
              _a.trys.push([3, 11, , 13]);
              if (
                !(
                  payment.type === shared_1.PaymentType.CARD &&
                  payment.stripeChargeId
                )
              )
                return [3 /*break*/, 6];
              return [
                4 /*yield*/,
                this.stripeService.processRefund({
                  chargeId: payment.stripeChargeId,
                  amount: refundAmount * 100, // Convert to cents
                  reason: refundPaymentDto.reason,
                }),
              ];
            case 4:
              stripeRefund = _a.sent();
              return [
                4 /*yield*/,
                this.refundRepository.update(savedRefund.id, {
                  status: shared_1.RefundStatus.COMPLETED,
                  stripeRefundId: stripeRefund.id,
                  processedAt: new Date(),
                }),
              ];
            case 5:
              _a.sent();
              return [3 /*break*/, 8];
            case 6:
              // Handle other payment types
              return [
                4 /*yield*/,
                this.refundRepository.update(savedRefund.id, {
                  status: shared_1.RefundStatus.COMPLETED,
                  processedAt: new Date(),
                }),
              ];
            case 7:
              // Handle other payment types
              _a.sent();
              _a.label = 8;
            case 8:
              if (!(payment.remainingAmount - refundAmount <= 0))
                return [3 /*break*/, 10];
              return [
                4 /*yield*/,
                this.paymentRepository.update(payment.id, {
                  status: shared_1.PaymentStatus.REFUNDED,
                }),
              ];
            case 9:
              _a.sent();
              _a.label = 10;
            case 10:
              // Emit refund completed event
              this.kafkaClient.emit('refund.completed', {
                refundId: savedRefund.id,
                paymentId: payment.id,
                reservationId: payment.reservationId,
                amount: refundAmount,
                currency: payment.currency,
              });
              return [
                2 /*return*/,
                this.refundRepository.findOne({
                  where: { id: savedRefund.id },
                  relations: ['payment'],
                }),
              ];
            case 11:
              error_2 = _a.sent();
              return [
                4 /*yield*/,
                this.refundRepository.update(savedRefund.id, {
                  status: shared_1.RefundStatus.FAILED,
                  failedAt: new Date(),
                  failureReason: error_2.message,
                }),
              ];
            case 12:
              _a.sent();
              throw error_2;
            case 13:
              return [2 /*return*/];
          }
        });
      });
    };
    PaymentService_1.prototype.update = function (id, updatePaymentDto) {
      return __awaiter(this, void 0, void 0, function () {
        var payment;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, this.findOne(id)];
            case 1:
              payment = _a.sent();
              return [
                4 /*yield*/,
                this.paymentRepository.update(id, updatePaymentDto),
              ];
            case 2:
              _a.sent();
              return [2 /*return*/, this.findOne(id)];
          }
        });
      });
    };
    PaymentService_1.prototype.remove = function (id) {
      return __awaiter(this, void 0, void 0, function () {
        var payment;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, this.findOne(id)];
            case 1:
              payment = _a.sent();
              if (payment.status === shared_1.PaymentStatus.COMPLETED) {
                throw new common_1.BadRequestException(
                  'Cannot delete completed payment'
                );
              }
              return [4 /*yield*/, this.paymentRepository.delete(id)];
            case 2:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    };
    // Payment Methods
    PaymentService_1.prototype.createPaymentMethod = function (
      createPaymentMethodDto
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var paymentMethod;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (!createPaymentMethodDto.isDefault) return [3 /*break*/, 2];
              return [
                4 /*yield*/,
                this.paymentMethodRepository.update(
                  { userId: createPaymentMethodDto.userId, isDefault: true },
                  { isDefault: false }
                ),
              ];
            case 1:
              _a.sent();
              _a.label = 2;
            case 2:
              paymentMethod = this.paymentMethodRepository.create(
                createPaymentMethodDto
              );
              return [
                2 /*return*/,
                this.paymentMethodRepository.save(paymentMethod),
              ];
          }
        });
      });
    };
    PaymentService_1.prototype.findPaymentMethodsByUser = function (userId) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [
            2 /*return*/,
            this.paymentMethodRepository.find({
              where: { userId: userId, isActive: true },
              order: { isDefault: 'DESC', createdAt: 'DESC' },
            }),
          ];
        });
      });
    };
    PaymentService_1.prototype.updatePaymentMethod = function (
      id,
      updatePaymentMethodDto
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var paymentMethod;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                this.paymentMethodRepository.findOne({ where: { id: id } }),
              ];
            case 1:
              paymentMethod = _a.sent();
              if (!paymentMethod) {
                throw new common_1.NotFoundException(
                  'Payment method not found'
                );
              }
              if (!updatePaymentMethodDto.isDefault) return [3 /*break*/, 3];
              return [
                4 /*yield*/,
                this.paymentMethodRepository.update(
                  { userId: paymentMethod.userId, isDefault: true },
                  { isDefault: false }
                ),
              ];
            case 2:
              _a.sent();
              _a.label = 3;
            case 3:
              return [
                4 /*yield*/,
                this.paymentMethodRepository.update(id, updatePaymentMethodDto),
              ];
            case 4:
              _a.sent();
              return [
                2 /*return*/,
                this.paymentMethodRepository.findOne({ where: { id: id } }),
              ];
          }
        });
      });
    };
    PaymentService_1.prototype.removePaymentMethod = function (id) {
      return __awaiter(this, void 0, void 0, function () {
        var paymentMethod;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                this.paymentMethodRepository.findOne({ where: { id: id } }),
              ];
            case 1:
              paymentMethod = _a.sent();
              if (!paymentMethod) {
                throw new common_1.NotFoundException(
                  'Payment method not found'
                );
              }
              return [
                4 /*yield*/,
                this.paymentMethodRepository.update(id, { isActive: false }),
              ];
            case 2:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    };
    return PaymentService_1;
  })());
  __setFunctionName(_classThis, 'PaymentService');
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
    PaymentService = _classThis = _classDescriptor.value;
    if (_metadata)
      Object.defineProperty(_classThis, Symbol.metadata, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _metadata,
      });
    __runInitializers(_classThis, _classExtraInitializers);
  })();
  return (PaymentService = _classThis);
})();
exports.PaymentService = PaymentService;

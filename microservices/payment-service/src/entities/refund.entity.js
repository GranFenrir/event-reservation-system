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
exports.Refund = void 0;
var typeorm_1 = require('typeorm');
var shared_1 = require('@event-reservation/shared');
var payment_entity_1 = require('./payment.entity');
var Refund = (function () {
  var _classDecorators = [(0, typeorm_1.Entity)('refunds')];
  var _classDescriptor;
  var _classExtraInitializers = [];
  var _classThis;
  var _id_decorators;
  var _id_initializers = [];
  var _id_extraInitializers = [];
  var _paymentId_decorators;
  var _paymentId_initializers = [];
  var _paymentId_extraInitializers = [];
  var _payment_decorators;
  var _payment_initializers = [];
  var _payment_extraInitializers = [];
  var _amount_decorators;
  var _amount_initializers = [];
  var _amount_extraInitializers = [];
  var _currency_decorators;
  var _currency_initializers = [];
  var _currency_extraInitializers = [];
  var _status_decorators;
  var _status_initializers = [];
  var _status_extraInitializers = [];
  var _stripeRefundId_decorators;
  var _stripeRefundId_initializers = [];
  var _stripeRefundId_extraInitializers = [];
  var _reason_decorators;
  var _reason_initializers = [];
  var _reason_extraInitializers = [];
  var _processedAt_decorators;
  var _processedAt_initializers = [];
  var _processedAt_extraInitializers = [];
  var _failedAt_decorators;
  var _failedAt_initializers = [];
  var _failedAt_extraInitializers = [];
  var _failureReason_decorators;
  var _failureReason_initializers = [];
  var _failureReason_extraInitializers = [];
  var _metadata_decorators;
  var _metadata_initializers = [];
  var _metadata_extraInitializers = [];
  var _createdAt_decorators;
  var _createdAt_initializers = [];
  var _createdAt_extraInitializers = [];
  var _updatedAt_decorators;
  var _updatedAt_initializers = [];
  var _updatedAt_extraInitializers = [];
  var Refund = (_classThis = /** @class */ (function () {
    function Refund_1() {
      this.id = __runInitializers(this, _id_initializers, void 0);
      this.paymentId =
        (__runInitializers(this, _id_extraInitializers),
        __runInitializers(this, _paymentId_initializers, void 0));
      this.payment =
        (__runInitializers(this, _paymentId_extraInitializers),
        __runInitializers(this, _payment_initializers, void 0));
      this.amount =
        (__runInitializers(this, _payment_extraInitializers),
        __runInitializers(this, _amount_initializers, void 0));
      this.currency =
        (__runInitializers(this, _amount_extraInitializers),
        __runInitializers(this, _currency_initializers, void 0));
      this.status =
        (__runInitializers(this, _currency_extraInitializers),
        __runInitializers(this, _status_initializers, void 0));
      this.stripeRefundId =
        (__runInitializers(this, _status_extraInitializers),
        __runInitializers(this, _stripeRefundId_initializers, void 0));
      this.reason =
        (__runInitializers(this, _stripeRefundId_extraInitializers),
        __runInitializers(this, _reason_initializers, void 0));
      this.processedAt =
        (__runInitializers(this, _reason_extraInitializers),
        __runInitializers(this, _processedAt_initializers, void 0));
      this.failedAt =
        (__runInitializers(this, _processedAt_extraInitializers),
        __runInitializers(this, _failedAt_initializers, void 0));
      this.failureReason =
        (__runInitializers(this, _failedAt_extraInitializers),
        __runInitializers(this, _failureReason_initializers, void 0));
      this.metadata =
        (__runInitializers(this, _failureReason_extraInitializers),
        __runInitializers(this, _metadata_initializers, void 0));
      this.createdAt =
        (__runInitializers(this, _metadata_extraInitializers),
        __runInitializers(this, _createdAt_initializers, void 0));
      this.updatedAt =
        (__runInitializers(this, _createdAt_extraInitializers),
        __runInitializers(this, _updatedAt_initializers, void 0));
      __runInitializers(this, _updatedAt_extraInitializers);
    }
    Object.defineProperty(Refund_1.prototype, 'isSuccessful', {
      // Virtual properties
      get: function () {
        return this.status === shared_1.RefundStatus.COMPLETED;
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(Refund_1.prototype, 'isFailed', {
      get: function () {
        return this.status === shared_1.RefundStatus.FAILED;
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(Refund_1.prototype, 'isPending', {
      get: function () {
        return this.status === shared_1.RefundStatus.PENDING;
      },
      enumerable: false,
      configurable: true,
    });
    return Refund_1;
  })());
  __setFunctionName(_classThis, 'Refund');
  (function () {
    var _metadata =
      typeof Symbol === 'function' && Symbol.metadata
        ? Object.create(null)
        : void 0;
    _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
    _paymentId_decorators = [(0, typeorm_1.Column)({ name: 'payment_id' })];
    _payment_decorators = [
      (0, typeorm_1.ManyToOne)(
        function () {
          return payment_entity_1.Payment;
        },
        function (payment) {
          return payment.refunds;
        }
      ),
      (0, typeorm_1.JoinColumn)({ name: 'payment_id' }),
    ];
    _amount_decorators = [
      (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    ];
    _currency_decorators = [
      (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'USD' }),
    ];
    _status_decorators = [
      (0, typeorm_1.Column)({
        type: 'enum',
        enum: shared_1.RefundStatus,
        default: shared_1.RefundStatus.PENDING,
      }),
    ];
    _stripeRefundId_decorators = [
      (0, typeorm_1.Column)({ name: 'stripe_refund_id', nullable: true }),
    ];
    _reason_decorators = [
      (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    ];
    _processedAt_decorators = [
      (0, typeorm_1.Column)({ name: 'processed_at', nullable: true }),
    ];
    _failedAt_decorators = [
      (0, typeorm_1.Column)({ name: 'failed_at', nullable: true }),
    ];
    _failureReason_decorators = [
      (0, typeorm_1.Column)({ name: 'failure_reason', nullable: true }),
    ];
    _metadata_decorators = [
      (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    ];
    _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
    _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
    __esDecorate(
      null,
      null,
      _id_decorators,
      {
        kind: 'field',
        name: 'id',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'id' in obj;
          },
          get: function (obj) {
            return obj.id;
          },
          set: function (obj, value) {
            obj.id = value;
          },
        },
        metadata: _metadata,
      },
      _id_initializers,
      _id_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _paymentId_decorators,
      {
        kind: 'field',
        name: 'paymentId',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'paymentId' in obj;
          },
          get: function (obj) {
            return obj.paymentId;
          },
          set: function (obj, value) {
            obj.paymentId = value;
          },
        },
        metadata: _metadata,
      },
      _paymentId_initializers,
      _paymentId_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _payment_decorators,
      {
        kind: 'field',
        name: 'payment',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'payment' in obj;
          },
          get: function (obj) {
            return obj.payment;
          },
          set: function (obj, value) {
            obj.payment = value;
          },
        },
        metadata: _metadata,
      },
      _payment_initializers,
      _payment_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _amount_decorators,
      {
        kind: 'field',
        name: 'amount',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'amount' in obj;
          },
          get: function (obj) {
            return obj.amount;
          },
          set: function (obj, value) {
            obj.amount = value;
          },
        },
        metadata: _metadata,
      },
      _amount_initializers,
      _amount_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _currency_decorators,
      {
        kind: 'field',
        name: 'currency',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'currency' in obj;
          },
          get: function (obj) {
            return obj.currency;
          },
          set: function (obj, value) {
            obj.currency = value;
          },
        },
        metadata: _metadata,
      },
      _currency_initializers,
      _currency_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _status_decorators,
      {
        kind: 'field',
        name: 'status',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'status' in obj;
          },
          get: function (obj) {
            return obj.status;
          },
          set: function (obj, value) {
            obj.status = value;
          },
        },
        metadata: _metadata,
      },
      _status_initializers,
      _status_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _stripeRefundId_decorators,
      {
        kind: 'field',
        name: 'stripeRefundId',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'stripeRefundId' in obj;
          },
          get: function (obj) {
            return obj.stripeRefundId;
          },
          set: function (obj, value) {
            obj.stripeRefundId = value;
          },
        },
        metadata: _metadata,
      },
      _stripeRefundId_initializers,
      _stripeRefundId_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _reason_decorators,
      {
        kind: 'field',
        name: 'reason',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'reason' in obj;
          },
          get: function (obj) {
            return obj.reason;
          },
          set: function (obj, value) {
            obj.reason = value;
          },
        },
        metadata: _metadata,
      },
      _reason_initializers,
      _reason_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _processedAt_decorators,
      {
        kind: 'field',
        name: 'processedAt',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'processedAt' in obj;
          },
          get: function (obj) {
            return obj.processedAt;
          },
          set: function (obj, value) {
            obj.processedAt = value;
          },
        },
        metadata: _metadata,
      },
      _processedAt_initializers,
      _processedAt_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _failedAt_decorators,
      {
        kind: 'field',
        name: 'failedAt',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'failedAt' in obj;
          },
          get: function (obj) {
            return obj.failedAt;
          },
          set: function (obj, value) {
            obj.failedAt = value;
          },
        },
        metadata: _metadata,
      },
      _failedAt_initializers,
      _failedAt_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _failureReason_decorators,
      {
        kind: 'field',
        name: 'failureReason',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'failureReason' in obj;
          },
          get: function (obj) {
            return obj.failureReason;
          },
          set: function (obj, value) {
            obj.failureReason = value;
          },
        },
        metadata: _metadata,
      },
      _failureReason_initializers,
      _failureReason_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _metadata_decorators,
      {
        kind: 'field',
        name: 'metadata',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'metadata' in obj;
          },
          get: function (obj) {
            return obj.metadata;
          },
          set: function (obj, value) {
            obj.metadata = value;
          },
        },
        metadata: _metadata,
      },
      _metadata_initializers,
      _metadata_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _createdAt_decorators,
      {
        kind: 'field',
        name: 'createdAt',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'createdAt' in obj;
          },
          get: function (obj) {
            return obj.createdAt;
          },
          set: function (obj, value) {
            obj.createdAt = value;
          },
        },
        metadata: _metadata,
      },
      _createdAt_initializers,
      _createdAt_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _updatedAt_decorators,
      {
        kind: 'field',
        name: 'updatedAt',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'updatedAt' in obj;
          },
          get: function (obj) {
            return obj.updatedAt;
          },
          set: function (obj, value) {
            obj.updatedAt = value;
          },
        },
        metadata: _metadata,
      },
      _updatedAt_initializers,
      _updatedAt_extraInitializers
    );
    __esDecorate(
      null,
      (_classDescriptor = { value: _classThis }),
      _classDecorators,
      { kind: 'class', name: _classThis.name, metadata: _metadata },
      null,
      _classExtraInitializers
    );
    Refund = _classThis = _classDescriptor.value;
    if (_metadata)
      Object.defineProperty(_classThis, Symbol.metadata, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _metadata,
      });
    __runInitializers(_classThis, _classExtraInitializers);
  })();
  return (Refund = _classThis);
})();
exports.Refund = Refund;

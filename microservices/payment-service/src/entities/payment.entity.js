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
exports.Payment = void 0;
var typeorm_1 = require('typeorm');
var shared_1 = require('@event-reservation/shared');
var payment_method_entity_1 = require('./payment-method.entity');
var refund_entity_1 = require('./refund.entity');
var Payment = (function () {
  var _classDecorators = [(0, typeorm_1.Entity)('payments')];
  var _classDescriptor;
  var _classExtraInitializers = [];
  var _classThis;
  var _id_decorators;
  var _id_initializers = [];
  var _id_extraInitializers = [];
  var _reservationId_decorators;
  var _reservationId_initializers = [];
  var _reservationId_extraInitializers = [];
  var _userId_decorators;
  var _userId_initializers = [];
  var _userId_extraInitializers = [];
  var _eventId_decorators;
  var _eventId_initializers = [];
  var _eventId_extraInitializers = [];
  var _amount_decorators;
  var _amount_initializers = [];
  var _amount_extraInitializers = [];
  var _currency_decorators;
  var _currency_initializers = [];
  var _currency_extraInitializers = [];
  var _status_decorators;
  var _status_initializers = [];
  var _status_extraInitializers = [];
  var _type_decorators;
  var _type_initializers = [];
  var _type_extraInitializers = [];
  var _paymentMethodId_decorators;
  var _paymentMethodId_initializers = [];
  var _paymentMethodId_extraInitializers = [];
  var _paymentMethod_decorators;
  var _paymentMethod_initializers = [];
  var _paymentMethod_extraInitializers = [];
  var _stripePaymentIntentId_decorators;
  var _stripePaymentIntentId_initializers = [];
  var _stripePaymentIntentId_extraInitializers = [];
  var _stripeChargeId_decorators;
  var _stripeChargeId_initializers = [];
  var _stripeChargeId_extraInitializers = [];
  var _processedAt_decorators;
  var _processedAt_initializers = [];
  var _processedAt_extraInitializers = [];
  var _failedAt_decorators;
  var _failedAt_initializers = [];
  var _failedAt_extraInitializers = [];
  var _failureReason_decorators;
  var _failureReason_initializers = [];
  var _failureReason_extraInitializers = [];
  var _notes_decorators;
  var _notes_initializers = [];
  var _notes_extraInitializers = [];
  var _metadata_decorators;
  var _metadata_initializers = [];
  var _metadata_extraInitializers = [];
  var _refunds_decorators;
  var _refunds_initializers = [];
  var _refunds_extraInitializers = [];
  var _createdAt_decorators;
  var _createdAt_initializers = [];
  var _createdAt_extraInitializers = [];
  var _updatedAt_decorators;
  var _updatedAt_initializers = [];
  var _updatedAt_extraInitializers = [];
  var Payment = (_classThis = /** @class */ (function () {
    function Payment_1() {
      this.id = __runInitializers(this, _id_initializers, void 0);
      this.reservationId =
        (__runInitializers(this, _id_extraInitializers),
        __runInitializers(this, _reservationId_initializers, void 0));
      this.userId =
        (__runInitializers(this, _reservationId_extraInitializers),
        __runInitializers(this, _userId_initializers, void 0));
      this.eventId =
        (__runInitializers(this, _userId_extraInitializers),
        __runInitializers(this, _eventId_initializers, void 0));
      this.amount =
        (__runInitializers(this, _eventId_extraInitializers),
        __runInitializers(this, _amount_initializers, void 0));
      this.currency =
        (__runInitializers(this, _amount_extraInitializers),
        __runInitializers(this, _currency_initializers, void 0));
      this.status =
        (__runInitializers(this, _currency_extraInitializers),
        __runInitializers(this, _status_initializers, void 0));
      this.type =
        (__runInitializers(this, _status_extraInitializers),
        __runInitializers(this, _type_initializers, void 0));
      this.paymentMethodId =
        (__runInitializers(this, _type_extraInitializers),
        __runInitializers(this, _paymentMethodId_initializers, void 0));
      this.paymentMethod =
        (__runInitializers(this, _paymentMethodId_extraInitializers),
        __runInitializers(this, _paymentMethod_initializers, void 0));
      this.stripePaymentIntentId =
        (__runInitializers(this, _paymentMethod_extraInitializers),
        __runInitializers(this, _stripePaymentIntentId_initializers, void 0));
      this.stripeChargeId =
        (__runInitializers(this, _stripePaymentIntentId_extraInitializers),
        __runInitializers(this, _stripeChargeId_initializers, void 0));
      this.processedAt =
        (__runInitializers(this, _stripeChargeId_extraInitializers),
        __runInitializers(this, _processedAt_initializers, void 0));
      this.failedAt =
        (__runInitializers(this, _processedAt_extraInitializers),
        __runInitializers(this, _failedAt_initializers, void 0));
      this.failureReason =
        (__runInitializers(this, _failedAt_extraInitializers),
        __runInitializers(this, _failureReason_initializers, void 0));
      this.notes =
        (__runInitializers(this, _failureReason_extraInitializers),
        __runInitializers(this, _notes_initializers, void 0));
      this.metadata =
        (__runInitializers(this, _notes_extraInitializers),
        __runInitializers(this, _metadata_initializers, void 0));
      this.refunds =
        (__runInitializers(this, _metadata_extraInitializers),
        __runInitializers(this, _refunds_initializers, void 0));
      this.createdAt =
        (__runInitializers(this, _refunds_extraInitializers),
        __runInitializers(this, _createdAt_initializers, void 0));
      this.updatedAt =
        (__runInitializers(this, _createdAt_extraInitializers),
        __runInitializers(this, _updatedAt_initializers, void 0));
      __runInitializers(this, _updatedAt_extraInitializers);
    }
    Object.defineProperty(Payment_1.prototype, 'isSuccessful', {
      // Virtual properties
      get: function () {
        return this.status === shared_1.PaymentStatus.COMPLETED;
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(Payment_1.prototype, 'isFailed', {
      get: function () {
        return this.status === shared_1.PaymentStatus.FAILED;
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(Payment_1.prototype, 'isPending', {
      get: function () {
        return this.status === shared_1.PaymentStatus.PENDING;
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(Payment_1.prototype, 'totalRefunded', {
      get: function () {
        var _a;
        return (
          ((_a = this.refunds) === null || _a === void 0
            ? void 0
            : _a.reduce(function (sum, refund) {
                return sum + Number(refund.amount);
              }, 0)) || 0
        );
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(Payment_1.prototype, 'remainingAmount', {
      get: function () {
        return Number(this.amount) - this.totalRefunded;
      },
      enumerable: false,
      configurable: true,
    });
    return Payment_1;
  })());
  __setFunctionName(_classThis, 'Payment');
  (function () {
    var _metadata =
      typeof Symbol === 'function' && Symbol.metadata
        ? Object.create(null)
        : void 0;
    _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
    _reservationId_decorators = [
      (0, typeorm_1.Column)({ name: 'reservation_id' }),
    ];
    _userId_decorators = [(0, typeorm_1.Column)({ name: 'user_id' })];
    _eventId_decorators = [(0, typeorm_1.Column)({ name: 'event_id' })];
    _amount_decorators = [
      (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    ];
    _currency_decorators = [
      (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'USD' }),
    ];
    _status_decorators = [
      (0, typeorm_1.Column)({
        type: 'enum',
        enum: shared_1.PaymentStatus,
        default: shared_1.PaymentStatus.PENDING,
      }),
    ];
    _type_decorators = [
      (0, typeorm_1.Column)({
        type: 'enum',
        enum: shared_1.PaymentType,
        default: shared_1.PaymentType.CARD,
      }),
    ];
    _paymentMethodId_decorators = [
      (0, typeorm_1.Column)({ name: 'payment_method_id', nullable: true }),
    ];
    _paymentMethod_decorators = [
      (0, typeorm_1.ManyToOne)(
        function () {
          return payment_method_entity_1.PaymentMethod;
        },
        { nullable: true }
      ),
      (0, typeorm_1.JoinColumn)({ name: 'payment_method_id' }),
    ];
    _stripePaymentIntentId_decorators = [
      (0, typeorm_1.Column)({
        name: 'stripe_payment_intent_id',
        nullable: true,
      }),
    ];
    _stripeChargeId_decorators = [
      (0, typeorm_1.Column)({ name: 'stripe_charge_id', nullable: true }),
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
    _notes_decorators = [
      (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    ];
    _metadata_decorators = [
      (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    ];
    _refunds_decorators = [
      (0, typeorm_1.OneToMany)(
        function () {
          return refund_entity_1.Refund;
        },
        function (refund) {
          return refund.payment;
        }
      ),
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
      _reservationId_decorators,
      {
        kind: 'field',
        name: 'reservationId',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'reservationId' in obj;
          },
          get: function (obj) {
            return obj.reservationId;
          },
          set: function (obj, value) {
            obj.reservationId = value;
          },
        },
        metadata: _metadata,
      },
      _reservationId_initializers,
      _reservationId_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _userId_decorators,
      {
        kind: 'field',
        name: 'userId',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'userId' in obj;
          },
          get: function (obj) {
            return obj.userId;
          },
          set: function (obj, value) {
            obj.userId = value;
          },
        },
        metadata: _metadata,
      },
      _userId_initializers,
      _userId_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _eventId_decorators,
      {
        kind: 'field',
        name: 'eventId',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'eventId' in obj;
          },
          get: function (obj) {
            return obj.eventId;
          },
          set: function (obj, value) {
            obj.eventId = value;
          },
        },
        metadata: _metadata,
      },
      _eventId_initializers,
      _eventId_extraInitializers
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
      _type_decorators,
      {
        kind: 'field',
        name: 'type',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'type' in obj;
          },
          get: function (obj) {
            return obj.type;
          },
          set: function (obj, value) {
            obj.type = value;
          },
        },
        metadata: _metadata,
      },
      _type_initializers,
      _type_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _paymentMethodId_decorators,
      {
        kind: 'field',
        name: 'paymentMethodId',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'paymentMethodId' in obj;
          },
          get: function (obj) {
            return obj.paymentMethodId;
          },
          set: function (obj, value) {
            obj.paymentMethodId = value;
          },
        },
        metadata: _metadata,
      },
      _paymentMethodId_initializers,
      _paymentMethodId_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _paymentMethod_decorators,
      {
        kind: 'field',
        name: 'paymentMethod',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'paymentMethod' in obj;
          },
          get: function (obj) {
            return obj.paymentMethod;
          },
          set: function (obj, value) {
            obj.paymentMethod = value;
          },
        },
        metadata: _metadata,
      },
      _paymentMethod_initializers,
      _paymentMethod_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _stripePaymentIntentId_decorators,
      {
        kind: 'field',
        name: 'stripePaymentIntentId',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'stripePaymentIntentId' in obj;
          },
          get: function (obj) {
            return obj.stripePaymentIntentId;
          },
          set: function (obj, value) {
            obj.stripePaymentIntentId = value;
          },
        },
        metadata: _metadata,
      },
      _stripePaymentIntentId_initializers,
      _stripePaymentIntentId_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _stripeChargeId_decorators,
      {
        kind: 'field',
        name: 'stripeChargeId',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'stripeChargeId' in obj;
          },
          get: function (obj) {
            return obj.stripeChargeId;
          },
          set: function (obj, value) {
            obj.stripeChargeId = value;
          },
        },
        metadata: _metadata,
      },
      _stripeChargeId_initializers,
      _stripeChargeId_extraInitializers
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
      _notes_decorators,
      {
        kind: 'field',
        name: 'notes',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'notes' in obj;
          },
          get: function (obj) {
            return obj.notes;
          },
          set: function (obj, value) {
            obj.notes = value;
          },
        },
        metadata: _metadata,
      },
      _notes_initializers,
      _notes_extraInitializers
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
      _refunds_decorators,
      {
        kind: 'field',
        name: 'refunds',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'refunds' in obj;
          },
          get: function (obj) {
            return obj.refunds;
          },
          set: function (obj, value) {
            obj.refunds = value;
          },
        },
        metadata: _metadata,
      },
      _refunds_initializers,
      _refunds_extraInitializers
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
    Payment = _classThis = _classDescriptor.value;
    if (_metadata)
      Object.defineProperty(_classThis, Symbol.metadata, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _metadata,
      });
    __runInitializers(_classThis, _classExtraInitializers);
  })();
  return (Payment = _classThis);
})();
exports.Payment = Payment;

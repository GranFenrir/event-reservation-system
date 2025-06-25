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
exports.PaymentMethod = void 0;
var typeorm_1 = require('typeorm');
var shared_1 = require('@event-reservation/shared');
var PaymentMethod = (function () {
  var _classDecorators = [(0, typeorm_1.Entity)('payment_methods')];
  var _classDescriptor;
  var _classExtraInitializers = [];
  var _classThis;
  var _id_decorators;
  var _id_initializers = [];
  var _id_extraInitializers = [];
  var _userId_decorators;
  var _userId_initializers = [];
  var _userId_extraInitializers = [];
  var _type_decorators;
  var _type_initializers = [];
  var _type_extraInitializers = [];
  var _stripePaymentMethodId_decorators;
  var _stripePaymentMethodId_initializers = [];
  var _stripePaymentMethodId_extraInitializers = [];
  var _lastFour_decorators;
  var _lastFour_initializers = [];
  var _lastFour_extraInitializers = [];
  var _cardBrand_decorators;
  var _cardBrand_initializers = [];
  var _cardBrand_extraInitializers = [];
  var _expiryMonth_decorators;
  var _expiryMonth_initializers = [];
  var _expiryMonth_extraInitializers = [];
  var _expiryYear_decorators;
  var _expiryYear_initializers = [];
  var _expiryYear_extraInitializers = [];
  var _isDefault_decorators;
  var _isDefault_initializers = [];
  var _isDefault_extraInitializers = [];
  var _isActive_decorators;
  var _isActive_initializers = [];
  var _isActive_extraInitializers = [];
  var _createdAt_decorators;
  var _createdAt_initializers = [];
  var _createdAt_extraInitializers = [];
  var _updatedAt_decorators;
  var _updatedAt_initializers = [];
  var _updatedAt_extraInitializers = [];
  var PaymentMethod = (_classThis = /** @class */ (function () {
    function PaymentMethod_1() {
      this.id = __runInitializers(this, _id_initializers, void 0);
      this.userId =
        (__runInitializers(this, _id_extraInitializers),
        __runInitializers(this, _userId_initializers, void 0));
      this.type =
        (__runInitializers(this, _userId_extraInitializers),
        __runInitializers(this, _type_initializers, void 0));
      this.stripePaymentMethodId =
        (__runInitializers(this, _type_extraInitializers),
        __runInitializers(this, _stripePaymentMethodId_initializers, void 0));
      this.lastFour =
        (__runInitializers(this, _stripePaymentMethodId_extraInitializers),
        __runInitializers(this, _lastFour_initializers, void 0));
      this.cardBrand =
        (__runInitializers(this, _lastFour_extraInitializers),
        __runInitializers(this, _cardBrand_initializers, void 0));
      this.expiryMonth =
        (__runInitializers(this, _cardBrand_extraInitializers),
        __runInitializers(this, _expiryMonth_initializers, void 0));
      this.expiryYear =
        (__runInitializers(this, _expiryMonth_extraInitializers),
        __runInitializers(this, _expiryYear_initializers, void 0));
      this.isDefault =
        (__runInitializers(this, _expiryYear_extraInitializers),
        __runInitializers(this, _isDefault_initializers, void 0));
      this.isActive =
        (__runInitializers(this, _isDefault_extraInitializers),
        __runInitializers(this, _isActive_initializers, void 0));
      this.createdAt =
        (__runInitializers(this, _isActive_extraInitializers),
        __runInitializers(this, _createdAt_initializers, void 0));
      this.updatedAt =
        (__runInitializers(this, _createdAt_extraInitializers),
        __runInitializers(this, _updatedAt_initializers, void 0));
      __runInitializers(this, _updatedAt_extraInitializers);
    }
    Object.defineProperty(PaymentMethod_1.prototype, 'displayName', {
      // Virtual properties
      get: function () {
        if (
          this.type === shared_1.PaymentType.CARD &&
          this.cardBrand &&
          this.lastFour
        ) {
          return ''
            .concat(this.cardBrand.toUpperCase(), ' ending in ')
            .concat(this.lastFour);
        }
        return this.type.toUpperCase();
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(PaymentMethod_1.prototype, 'isExpired', {
      get: function () {
        if (!this.expiryMonth || !this.expiryYear) return false;
        var now = new Date();
        var expiry = new Date(this.expiryYear, this.expiryMonth - 1);
        return now > expiry;
      },
      enumerable: false,
      configurable: true,
    });
    return PaymentMethod_1;
  })());
  __setFunctionName(_classThis, 'PaymentMethod');
  (function () {
    var _metadata =
      typeof Symbol === 'function' && Symbol.metadata
        ? Object.create(null)
        : void 0;
    _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
    _userId_decorators = [(0, typeorm_1.Column)({ name: 'user_id' })];
    _type_decorators = [
      (0, typeorm_1.Column)({
        type: 'enum',
        enum: shared_1.PaymentType,
      }),
    ];
    _stripePaymentMethodId_decorators = [
      (0, typeorm_1.Column)({
        name: 'stripe_payment_method_id',
        nullable: true,
      }),
    ];
    _lastFour_decorators = [
      (0, typeorm_1.Column)({ name: 'last_four', nullable: true }),
    ];
    _cardBrand_decorators = [
      (0, typeorm_1.Column)({ name: 'card_brand', nullable: true }),
    ];
    _expiryMonth_decorators = [
      (0, typeorm_1.Column)({ name: 'expiry_month', nullable: true }),
    ];
    _expiryYear_decorators = [
      (0, typeorm_1.Column)({ name: 'expiry_year', nullable: true }),
    ];
    _isDefault_decorators = [
      (0, typeorm_1.Column)({ name: 'is_default', default: false }),
    ];
    _isActive_decorators = [
      (0, typeorm_1.Column)({ name: 'is_active', default: true }),
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
      _stripePaymentMethodId_decorators,
      {
        kind: 'field',
        name: 'stripePaymentMethodId',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'stripePaymentMethodId' in obj;
          },
          get: function (obj) {
            return obj.stripePaymentMethodId;
          },
          set: function (obj, value) {
            obj.stripePaymentMethodId = value;
          },
        },
        metadata: _metadata,
      },
      _stripePaymentMethodId_initializers,
      _stripePaymentMethodId_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _lastFour_decorators,
      {
        kind: 'field',
        name: 'lastFour',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'lastFour' in obj;
          },
          get: function (obj) {
            return obj.lastFour;
          },
          set: function (obj, value) {
            obj.lastFour = value;
          },
        },
        metadata: _metadata,
      },
      _lastFour_initializers,
      _lastFour_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _cardBrand_decorators,
      {
        kind: 'field',
        name: 'cardBrand',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'cardBrand' in obj;
          },
          get: function (obj) {
            return obj.cardBrand;
          },
          set: function (obj, value) {
            obj.cardBrand = value;
          },
        },
        metadata: _metadata,
      },
      _cardBrand_initializers,
      _cardBrand_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _expiryMonth_decorators,
      {
        kind: 'field',
        name: 'expiryMonth',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'expiryMonth' in obj;
          },
          get: function (obj) {
            return obj.expiryMonth;
          },
          set: function (obj, value) {
            obj.expiryMonth = value;
          },
        },
        metadata: _metadata,
      },
      _expiryMonth_initializers,
      _expiryMonth_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _expiryYear_decorators,
      {
        kind: 'field',
        name: 'expiryYear',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'expiryYear' in obj;
          },
          get: function (obj) {
            return obj.expiryYear;
          },
          set: function (obj, value) {
            obj.expiryYear = value;
          },
        },
        metadata: _metadata,
      },
      _expiryYear_initializers,
      _expiryYear_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _isDefault_decorators,
      {
        kind: 'field',
        name: 'isDefault',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'isDefault' in obj;
          },
          get: function (obj) {
            return obj.isDefault;
          },
          set: function (obj, value) {
            obj.isDefault = value;
          },
        },
        metadata: _metadata,
      },
      _isDefault_initializers,
      _isDefault_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _isActive_decorators,
      {
        kind: 'field',
        name: 'isActive',
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return 'isActive' in obj;
          },
          get: function (obj) {
            return obj.isActive;
          },
          set: function (obj, value) {
            obj.isActive = value;
          },
        },
        metadata: _metadata,
      },
      _isActive_initializers,
      _isActive_extraInitializers
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
    PaymentMethod = _classThis = _classDescriptor.value;
    if (_metadata)
      Object.defineProperty(_classThis, Symbol.metadata, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _metadata,
      });
    __runInitializers(_classThis, _classExtraInitializers);
  })();
  return (PaymentMethod = _classThis);
})();
exports.PaymentMethod = PaymentMethod;

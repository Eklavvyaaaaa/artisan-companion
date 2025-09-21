import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51S9RxXFP4tOb27gBJyHx2UrnGF6htdJMYZS1g5BDSHCCSNMqLuW2SIqPl9OX80MtaMxNeV1bcIVkRR46O1U9x0q200Ma8zznBd');

export default stripePromise;

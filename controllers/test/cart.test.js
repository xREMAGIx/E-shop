const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');

chai.should();
chai.use(chaiHttp);

describe(' Test API Cart', () => {

    // test get  show cart 
    describe("get/api/cart", () => {
        it('It should get all product in cart', (done) => {
            chai.request(server)
                .get('/api/cart')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                })
        })
    })


})
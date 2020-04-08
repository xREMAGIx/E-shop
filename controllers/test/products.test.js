const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');

chai.should();
chai.use(chaiHttp);

describe(' Test API Auth', () => {

    // test get  show cart 
    describe("get/api/auth", () => {
        it('It should xxxxxxxxx', (done) => {
            chai.request(server)
                .get('xxxxxx')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                })
        })
    })


})
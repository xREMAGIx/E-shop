const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');

chai.should();
chai.use(chaiHttp);

describe(' Test API Auth', () => {

    // test get  show cart 
    describe("xxxxxxxxxx", () => {
        it('It should xxxxxxxxx', (done) => {
            chai.request(server)
                .get()
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                })
        })
    })


})
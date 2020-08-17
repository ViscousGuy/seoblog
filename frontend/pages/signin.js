import SigninComponent from './../components/auth/signin.component'


import Layout from './../components/layout/layout.component';


const Signin = () => {
    return (
        <Layout>
            <h2 className='text-center pt-4 pb-4'>Signin</h2>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                <SigninComponent/>
                </div>
            </div>
        </Layout>
    );
};

export default Signin;

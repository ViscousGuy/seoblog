import Layout from '../../../components/layout/layout.component';
import Private from '../../../components/auth/private-route.component';
import BlogCreate from '../../../components/crud/blog-create.component.js';


const CreateBlog = () => {
    return (
        <Layout>
            <Private>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Create a new blog</h2>
                        </div>
                        <div className="col-md-12">
                            <BlogCreate/>
                        </div>
                    </div>
                </div>
            </Private>
        </Layout>
    );
};

export default CreateBlog;

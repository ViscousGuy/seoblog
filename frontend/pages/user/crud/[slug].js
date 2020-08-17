import Layout from '../../../components/layout/layout.component';
import Private from '../../../components/auth/private-route.component';
import BlogUpdate from '../../../components/crud/blog-update.component';
import Link from 'next/link';

const Blog = () => {
    
    return (
        <Layout>
            <Private>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Update blog</h2>
                        </div>
                        <div className="col-md-12">
                            <BlogUpdate />
                        </div>
                    </div>
                </div>
            </Private>
        </Layout>
    );
};

export default Blog;

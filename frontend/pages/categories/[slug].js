import moment from "moment";
import renderHTML from "react-render-html";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout/layout.component";
import { singleCategory } from "../../actions/category";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import { getCookie } from './../../actions/auth'
import Card from './../../components/blogs/blogs.card.component'

const Category = ({data, query}) => {
    const head = () => (
        <Head>
          <title>
            {data.category.name} | {APP_NAME}
          </title>
          <meta name="description" content={`Best blogs on ${data.category.name}`} />
          <link rel="canonical" href={`${DOMAIN}/categories/${query.slug}`} />
          <meta property="og:title" content={`${data.category.name}| ${APP_NAME}`} />
          <meta property="og:description" content={`Best blogs on ${data.category.name}`} />
          <meta property="og:type" content="webiste" />
          <meta property="og:url" content={`${DOMAIN}/categories/${query.slug}`} />
          <meta property="og:site_name" content={`${APP_NAME}`} />
    
          <meta
            property="og:image"
            content={`${DOMAIN}/static/images/seoblog.jpg`}
          />
          <meta
            property="og:image:secure_url"
            content={`${DOMAIN}/static/images/seoblog.jpg`}
          />
          <meta property="og:image:type" content="image/jpg" />
          <meta property="fb:app_id" content={`${FB_APP_ID}`} />
        </Head>
      );
    return (
        <React.Fragment>
            {head()}
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold">
                                    {data.category.name}
                                </h1>
                                {data.blogs.map((b, i) => {
                                    return (
                                        <div>
                                            <Card key={i} blog={b}></Card>
                                            <hr/>
                                        </div>
                                        
                                    )
                                })}
                            </div>
                        </header>
                    </div>
                </main>
            </Layout>
        </React.Fragment>
    )
}

Category.getInitialProps = ({query, req}) => {
    // const token = getCookie('token')
    const token = req.headers.cookie.split('=')[1]
    return singleCategory(query.slug, token).then(data => {
        if(data.error) console.log(data.error)
        else {
            return {data: data, query}
        }
    })

}






export default Category;

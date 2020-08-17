import Layout from '../../components/layout/layout.component';
import Private from '../../components/auth/private-route.component';
import ProfileUpdate from '../../components/auth/profile-update.component';
import Link from 'next/link';

const UserProfileUpdate = () => {
    return (
        <Layout>
            <Private>
                <div className="container-fluid">
                    <div className="row">
                        <ProfileUpdate />
                    </div>
                </div>
            </Private>
        </Layout>
    );
};

export default UserProfileUpdate;

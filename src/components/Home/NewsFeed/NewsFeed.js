import React from 'react';
import { auth } from '../../../firebase';

const NewsFeed = () => {

    return (
        <main className="home navbar-included">
            <section className="user-info">
                <img src={auth.currentUser.photoURL} alt="" />
                <h2>{auth.currentUser.displayName}</h2>
                <button>Update Profile</button>
            </section>
        </main>
    );
};

export default NewsFeed;
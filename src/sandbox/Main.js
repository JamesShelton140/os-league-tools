import React from 'react';
// import BlogEntry from '../components/BlogEntry';
// import NewsEntry from '../components/NewsEntry';
// import newsPosts from '../resources/newsPosts.json';
import PageWrapper from './PageWrapper';

export default function Homepage() {
    return (
        <PageWrapper>
            {/* <h1 className='mt-2 light-text'>heading</h1> */}
            {/* {newsPosts.map(newsPost =>
                newsPost.type === 'news' ? (
                    <NewsEntry
                        key={newsPost.title}
                        title={newsPost.title}
                        date={newsPost.date}
                        leadText={newsPost.leadText}
                        thumbnail={newsPost.thumbnail}
                        buttonLink={newsPost.buttonLink}
                        buttonText={newsPost.buttonText}
                    />
                ) : (
                    <BlogEntry
                        key={newsPost.title}
                        title={newsPost.title}
                        date={newsPost.date}
                        thumbnail={newsPost.thumbnail}
                        leadText={newsPost.leadText}
                        htmlContent={newsPost.htmlContent}
                    />
                )
            )} */}
        </PageWrapper>
    );
}

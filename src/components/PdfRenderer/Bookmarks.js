import React from 'react';
import { Document, Page } from 'react-pdf';

const Bookmarks = ({bookmarkedPages, file, setPageNumber}) => {
    if(bookmarkedPages.length > 0){
        return (
            <section className="bookmarks">
              <h3>Bookmarked Pages</h3>
              
                <Document
                  file={file}
                  onLoadError={console.error()}
                  className="pdf-doc-bookmarks"
                >
                  {bookmarkedPages.map((bookmarkedPageNum) => {
                    
                    return (
                      <div onClick={() => setPageNumber(bookmarkedPageNum)}>
                        <Page pageNumber={bookmarkedPageNum} height={100} renderAnnotationLayer={false} renderTextLayer={false} className="bookmarked-page"/>
                        <p>Page {bookmarkedPageNum}</p>
                      </div>
                    );
                  })}
                </Document>
              
            </section>
            );
    }
    return null
};

export default Bookmarks;
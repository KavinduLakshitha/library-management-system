import React from 'react'

const HeroSection = () => {

    const handleExploreClick = () => {
        const bookListElement = document.querySelector('.booklist-grid');
        bookListElement.scrollIntoView({ behavior: 'smooth' });
    };
  return (
    <div className="relative w-full font-garamond h-screen/2">
        <div className="container w-full mx-auto px-4 py-8 h-full flex items-center">
            <div className="flex flex-col md:flex-row items-center gap-10 h-full w-full">
                <div className="md:w-1/2">
                    <h1 className="text-6xl font-bold mb-4 text-gray-800">Discover a World of Books</h1>
                    <p className="text-3xl mb-8">
                        Explore our vast collection of books and download them for free!
                    </p>
                    <button
                         onClick={handleExploreClick}
                        className="bg-yellow-500 border-none outline-none px-6 py-3 rounded-md text-xl text-white hover:bg-yellow-700"
                    >
                        Start Exploring
                    </button>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0">
                    <img
                        src="./hero.webp"
                        alt="Books"
                        className="w-full rounded-lg"
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default HeroSection;
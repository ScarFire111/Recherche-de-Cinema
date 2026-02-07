import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here if needed
    navigate('/login');
  };

  const handleSearch = () => {
    navigate('/search');
  };

  return (
    <div className="twin-peaks-home">
      {/* Twin Peaks Background */}
      <div className="tp-background">
        <div className="tp-red-curtain left"></div>
        <div className="tp-red-curtain right"></div>
        <div className="tp-woods"></div>
        <div className="tp-black-lodge"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="tp-navbar">
        <div className="tp-nav-left">
          <h1 className="tp-logo">
            Recherche de Cinéma
            <span className="tp-logo-sub">Twin Peaks Edition</span>
          </h1>
        </div>
        
        <div className="tp-nav-right">
          <button className="tp-nav-btn search-btn" onClick={handleSearch}>
            🔍 Search
          </button>
          <button className="tp-nav-btn logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Main Content - Twin Peaks themed */}
      <main className="tp-main-content">
        <div className="tp-welcome-container">
          <h2 className="tp-welcome-title">Welcome to the Black Lodge</h2>
          <div className="tp-welcome-message">
            <p className="tp-quote">
              "Through the darkness of future past,<br />
              The magician longs to see.<br />
              One chants out between two worlds...<br />
              <span className="tp-fire">Fire walk with me.</span>"
            </p>
          </div>

          <div className="tp-instructions">
            <div className="tp-instruction">
              <div className="tp-icon">🦉</div>
              <p>Click <strong>Search</strong> to begin your cinematic journey</p>
            </div>
            <div className="tp-instruction">
              <div className="tp-icon">☕</div>
              <p>Remember: The owls are not what they seem</p>
            </div>
            <div className="tp-instruction">
              <div className="tp-icon">🎬</div>
              <p>Find movies that speak to your soul</p>
            </div>
          </div>
        </div>
      </main>
{/*wallahi comments that have been commented */}
      {/* Footer with Twin Peaks elements */}
      <footer className="tp-footer">
        <div className="tp-chevron-pattern"></div>
        <p className="tp-footer-text">
       Movies, also known as films or cinema, are one of the most influential and popular forms of entertainment in the modern world. Since their invention in the late nineteenth century, movies have evolved from short, silent clips into complex artistic productions that combine storytelling, visuals, sound, music, and performance. Today, movies are not only a source of entertainment but also a powerful medium for education, cultural exchange, social commentary, and emotional expression. Their ability to reflect society while also shaping it makes movies an important part of human life.

At their core, movies are a form of storytelling. Every movie, regardless of genre, tells a story—whether it is about love, conflict, adventure, fear, hope, or imagination. Unlike novels, which rely solely on words, movies use moving images, dialogue, music, and visual effects to communicate ideas. This makes them accessible to people of different ages, cultures, and literacy levels. A well-made movie can convey deep emotions and complex messages within a few hours, often leaving a lasting impact on the audience.

One of the most remarkable aspects of movies is their diversity of genres. There are action movies filled with excitement and danger, romantic movies that explore relationships and emotions, comedy movies that bring laughter and relief, horror movies that play with fear, and science fiction movies that imagine the future and technological possibilities. Drama films focus on realistic characters and emotional depth, while documentaries aim to present facts and real-life stories. This wide range of genres allows movies to cater to different tastes and preferences, ensuring that there is something for everyone.

Movies also play a significant role in reflecting society and culture. They often mirror the values, beliefs, struggles, and aspirations of the time in which they are made. For example, movies produced during times of war may focus on patriotism, sacrifice, or the horrors of conflict. Films addressing social issues such as poverty, gender equality, racism, or mental health can raise awareness and encourage discussion. In this way, movies act as a record of history and a platform for social change. Many films have challenged stereotypes and inspired audiences to think critically about the world around them.

In addition to reflecting culture, movies help spread culture across borders. With the rise of global cinema, people can now watch films from different countries and learn about foreign traditions, languages, and lifestyles. Hollywood movies have influenced fashion, music, and popular culture worldwide, while industries like Bollywood, Korean cinema, and Japanese animation have gained international recognition. This cultural exchange promotes understanding and appreciation among people from different backgrounds, making movies a unifying global force.

The emotional impact of movies is another reason for their popularity. A powerful film can make viewers laugh, cry, feel fear, or experience hope. Characters in movies often feel real, and audiences may see parts of themselves in them. This emotional connection allows people to escape from their daily problems and immerse themselves in another world for a short time. At the same time, movies can be deeply personal, helping individuals process their own feelings and experiences. For many people, movies provide comfort, inspiration, and motivation.

Technological advancements have greatly influenced the development of movies. From black-and-white silent films to color cinema, and from practical effects to computer-generated imagery (CGI), technology has expanded the possibilities of filmmaking. Modern movies can create realistic fantasy worlds, impressive action sequences, and visually stunning scenes that were impossible in the past. Sound design, background scores, and special effects enhance the overall experience, making movies more immersive and engaging. Streaming platforms have further transformed how people watch movies, allowing instant access to a vast library of films from home.

However, movies also have certain drawbacks. Excessive exposure to violent or inappropriate content can negatively influence young audiences if not properly guided. Some movies may promote unrealistic expectations, stereotypes, or harmful behaviors. Commercial pressure can also lead to a focus on profit rather than artistic quality, resulting in repetitive stories or unnecessary sequels. Therefore, it is important for viewers to watch movies critically and responsibly, understanding that films are interpretations of reality rather than reality itself.

Despite these challenges, the importance of movies in education cannot be ignored. Educational films and documentaries help explain complex topics in a simple and visual manner. Historical movies can spark interest in past events, while biographical films introduce audiences to influential personalities. Teachers increasingly use movies as teaching tools to make learning more engaging and relatable. When used thoughtfully, movies can enhance knowledge and encourage curiosity.

In conclusion, movies are far more than just entertainment. They are a powerful blend of art, technology, and storytelling that influence emotions, culture, and society. Movies entertain us, educate us, reflect our world, and sometimes challenge us to change it. As cinema continues to evolve with new technologies and ideas, its impact on human life is likely to grow even stronger. Whether watched alone or with others, movies remain a meaningful and memorable part of our shared human experience.
        </p>
      </footer>
    </div>
  );
};

export default Home;
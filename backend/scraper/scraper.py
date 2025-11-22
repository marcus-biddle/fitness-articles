from urllib.parse import urljoin
import undetected_chromedriver as uc
from bs4 import BeautifulSoup
import time
import random
import json

def scrape_fitness_articles():
    base_url = "https://onlinelibrary.wiley.com"  # Example base URL, replace with actual site base
    start_url = base_url + "/action/doSearch?Ppub=%5B20241121+TO+202511212359%5D&SeriesKey=16000838&sortBy=Earliest&startPage=&ConceptID=15941"  # Replace with actual target URL

    options = uc.ChromeOptions()
    # Comment out headless option if you want to watch browser
    # options.add_argument("--headless")

    driver = uc.Chrome(options=options)
    driver.get(start_url)

    time.sleep(random.uniform(10, 20))

    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")

    driver.quit()

    anchors = soup.find_all('a', class_='publication_title visitable')

    articles = []
    for a in anchors:
        relative_url = a.get('href')
        full_url = urljoin(base_url, relative_url)  # Combine base and relative URL

        articles.append(full_url)

    return articles

if __name__ == "__main__":
    articles = scrape_fitness_articles()
    print(json.dumps(articles))
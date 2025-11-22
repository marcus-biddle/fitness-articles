import unittest
from scraper import scrape_fitness_articles
import json

class TestScraper(unittest.TestCase):
    def test_scrape_and_print_articles(self):
        articles = scrape_fitness_articles()
        self.assertIsInstance(articles, list)

        for article in articles:
            print(f"Title: {article['title']}, URL: {article['url']}")

        if articles:
            article = articles[0]
            self.assertIn('title', article)
            self.assertIn('url', article)
            self.assertIsInstance(article['title'], str)
            self.assertIsInstance(article['url'], str)

if __name__ == '__main__':
    unittest.main(verbosity=2)  # Shows test names and print outputs
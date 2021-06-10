import pandas as pd
import numpy as np
from mlxtend.frequent_patterns import apriori
from mlxtend.frequent_patterns import association_rules

df = pd.read_csv("sepsis_events_categories.csv")
df.head()


# Result values need to be discretized here
# df.groupby(['event_name','result_val'])['result_val'].count()

# df.groupby(['event_name'])['event_name'].count()
basket = df.groupby(['fin','event_name'])['event_name'].count().unstack().reset_index().fillna(0).set_index('fin')
basket.head()


def encode_units(x):
    if x <= 0:
        return 0
    if x >= 1:
        return 1

basket_sets = basket.applymap(encode_units)


basket_random = basket_sets.sample(100)

frequent_itemsets = apriori(basket_random, min_support=0.07, use_colnames=True)
rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1)
print(rules.head())

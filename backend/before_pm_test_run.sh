# drop and recreate datebase
dropdb scribbles_blog_test && createdb scribbles_blog_test

# setup db with migration script
python manage.py db upgrade 

# Populate with a row of data
psql -d scribbles_blog_test -c "INSERT INTO public.posts VALUES (1, 'New post', 'Post body', NOW(), NOW(), 'Karen Okonkwo', NULL );"
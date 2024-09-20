from rest_framework import pagination


class ProductPaginator(pagination.PageNumberPagination):
    page_size = 6


class CategoryPaginator(pagination.PageNumberPagination):
    page_size = 5


class CommentPaginator(pagination.PageNumberPagination):
    page_size = 2


class BlogPaginator(pagination.PageNumberPagination):
    page_size = 4
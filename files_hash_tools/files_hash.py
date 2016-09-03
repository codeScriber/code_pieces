#!/usr/bin/env python

from __future__ import print_function
import sys
import os
import sqlite3
import hashlib
from script_utils import ScriptUtils 

class DBWrapper(object):
    """ Wrapper for the sqlite3 db to each create/insert/delete/search
        operations


    """
    DEFAULT_DATABASE_FILE = 'hashes_per_file.sqlite'
    HASH_TABLE = 'hash_and_path'
    COLLISION_VIEW = 'collisions'
    COL_PATH = 'path'
    COL_HASH = 'hash'
    COL_ID = '_id'
    sqlite3.enable_callback_tracebacks(True)
    def __init__(self, database_file=None):
        if database_file is None:
            self.database_file = os.path.join(ScriptUtils.get_script_dir(),\
                DBWrapper.DEFAULT_DATABASE_FILE)
        else:
            self.database_file = database_file
        self.cached_connection = None


    def get_hash_for_file(self, file_to_hash):
        md5hash = None
        with open(file_to_hash, 'rb') as file_handler:
            hasher = hashlib.md5()
            hasher.update(file_handler.read())
            md5hash = hasher.hexdigest()
        return md5hash

    def __get_database(self):
        if self.cached_connection is None:
            self.init_database()
        return self.cached_connection

    def __get_cursor(self):
        return self.__get_database().cursor()

    def init_database(self, drop_table_before_init=False):
        if self.cached_connection is not None:
            return
        self.cached_connection = sqlite3.connect(self.database_file)
        if drop_table_before_init:
            self.cached_connection.execute(r"DROP TABLE IF EXISTS %s" %\
                                           (DBWrapper.HASH_TABLE,))
        self.cached_connection.execute("""CREATE TABLE IF NOT EXISTS %s(
            %s INTEGER PRIMARY KEY AUTOINCREMENT,
            %s TEXT NOT NULL UNIQUE,
            %s TEXT NOT NULL);""" % (DBWrapper.HASH_TABLE, DBWrapper.COL_ID,\
                          DBWrapper.COL_PATH, DBWrapper.COL_HASH))
        self.cached_connection.execute("""CREATE VIEW IF NOT EXISTS %s AS
            SELECT t1.%s,t2.%s FROM %s as t1 INNER JOIN %s as t2 ON
            (t1.%s = t2.%s AND t1.%s > t2.%s AND t1.%s != t2.%s);""" % (\
            DBWrapper.COLLISION_VIEW, DBWrapper.COL_PATH, DBWrapper.COL_PATH,\
            DBWrapper.HASH_TABLE, DBWrapper.HASH_TABLE, DBWrapper.COL_HASH,\
            DBWrapper.COL_HASH, DBWrapper.COL_ID, DBWrapper.COL_ID, \
            DBWrapper.COL_PATH, DBWrapper.COL_PATH))


    def add_file_and_hash(self, file_to_add, hash_of_file=None):
        if hash_of_file is None:
            hash_of_file = self.get_hash_for_file(file_to_add)
        if hash_of_file is None:
            raise TypeError("could not create hash fr the file %s"\
                            % file_to_add)
        cursor = self.__get_cursor()
        cursor.execute("INSERT INTO %s (%s, %s) values(?, ?);"\
                       % (DBWrapper.HASH_TABLE, DBWrapper.COL_PATH,
                          DBWrapper.COL_HASH), (file_to_add,
                                                hash_of_file))
        cursor.close()
        self.__commit_db()

    def __commit_db(self):
        self.__get_database().commit()

    def add_files_from_collection(self, list_of_db_tuples):
        if list_of_db_tuples is None:
            raise TypeError("dictionary cannot be empty ornone")
        cursor = self.__get_cursor()
        cursor.executemany("INSERT INTO %s(%s, %s) values (?, ?)"\
                           % (DBWrapper.HASH_TABLE, DBWrapper.COL_PATH,\
                              DBWrapper.COL_HASH), list_of_db_tuples)
        cursor.close()
        self.__commit_db()

    def get_matching_lines_for_hash(self, hash):
        cursor = self.__get_cursor()
        result = cursor.execute('SELECT * FROM %s WHERE %s=?' %
                                (DBWrapper.HASH_TABLE,\
                                 DBWrapper.COL_HASH), (hash,))
        return result.fetchall()

    def get_matching_lines_like_hash(self, hash):
        cursor = self.__get_cursor()
        result = cursor.execute('SELECT * FROM %s WHERE %s like %%?%%' %
                                (DBWrapper.HASH_TABLE,\
                                 DBWrapper.COL_HASH), (hash,))
        return result.fetchall()

    def self_destruct(self):
        if self.cached_connection is not None:
            self.cached_connection.close()
            self.cached_connection = None
        if self.database_file is not None:
            os.unlink(self.database_file)

    def get_unfiltered_lines(self):
        cursor = self.__get_cursor()
        return cursor.execute("SELECT * FROM %s" %\
                              DBWrapper.HASH_TABLE).fetchall()

class FilesCollector(object):
    DEFAULT_SEARCHED_SUFFIXES = ['png', 'jpg', 'jpeg', 'mp4', 'avi']
    def __init__(self, found_file_handler):
        self.searched_files_suffix = FilesCollector.DEFAULT_SEARCHED_SUFFIXES
        self.found_file_handler = found_file_handler

    def set_default_searched_suffixes(self, suffixes):
        if suffixes is not None:
            self.searched_files_suffix = suffixes

    def get_file_suffix(self, filename):
        return filename.split('.')[-1]

    def search_in_root(self, searchdir):
        if self.found_file_handler != None:
            for rootdir, dirs, files in os.walk(searchdir):
                for onefile in files:
                    fullpath = os.path.realpath(os.path.join(rootdir, onefile))
                    suffix = self.get_file_suffix(onefile)
                    if suffix in self.searched_files_suffix:
                        self.found_file_handler.file_found(fullpath)



class DbFileAdderWrapper(object):
    def __init__(self, handler, rootpath):
        self.dbhandler = handler
        self.collector = FilesCollector(self)
        self.rootpath = rootpath

    def file_found(self, path):
        self.dbhandler.add_file_and_hash(path)

    def start_searching(self):
        self.collector.set_default_searched_suffixes(['jpeg','jpg','mp4','mpg'])
        self.collector.search_in_root(self.rootpath)


if __name__ == "__main__":
    class TextClass(object):
        def __init__(self):
            pass

        def file_found(self, path):
            print("found file ", path) 


    collector = FilesCollector(TextClass())
    collector.set_default_searched_suffixes(['py', 'pyc', 'sqlite'])
    collector.search_in_root('../')

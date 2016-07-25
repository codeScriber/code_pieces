#!/usr/bin/env python
import sys
import os

class ScriptUtils(object):
    """Utils to be used for all scripts


    """
    @staticmethod
    def __init__(self):
        pass

    @staticmethod
    def is_executable(program):
        full_path = os.path.abspath(program)
        return os.path.isfile(full_path) and os.access(full_path, os.X_OK)

    @staticmethod
    def shell_which(program):
        if ScriptUtils.is_executable(program):
            return program
        else:
            for pathitem in os.environ["PATH"].split(os.pathsep):
                pathitem = pathitem.strip()
                exec_item = os.path.join(pathitem, program)
                if ScriptUtils.is_executable(exec_item):
                    return exec_item

    @staticmethod
    def get_script_dir():
        """get the current scrpt file directory


        """
        return os.path.realpath(os.path.join(__file__, '..'))

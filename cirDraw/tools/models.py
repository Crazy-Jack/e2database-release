# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class SearchTable(models.Model):
    """User table, store statistic result"""
    Log2FC = models.FloatField(null=True, db_column='Log2FC')
    p_value = models.FloatField(null=True, db_column='p_value')
    padj = models.FloatField(null=True, db_column='padj')
    minus_log10p = models.FloatField(null=True, db_column='minus_log10p')
    minus_log10padj = models.FloatField(null=True, db_column='minus_log10padj')

    filename = models.CharField(max_length=255, db_column='filename')
    GeneName = models.CharField(max_length=255, db_column='GeneName')

    CellLine = models.CharField(max_length=255, db_column='CellLine', default="")
    RepL = models.CharField(max_length=255, db_column='RepL', default="")
    DataSet = models.CharField(max_length=255, db_column='DataSet', default="")
    Dose = models.IntegerField(db_column='Dose', default="")
    Rep = models.IntegerField(db_column='Rep', default="")
    Duration = models.IntegerField(db_column='Duration', default="")
    GSE = models.CharField(max_length=255, db_column='GSE', default="")

    class Meta:
        db_table = 'CombinedData'

class SearchTableRNAseq(models.Model):
    """RNAseq table"""
    Log2FC = models.FloatField(null=True, db_column='Log2FC')
    lfcSE = models.FloatField(null=True, db_column='lfcSE')
    stat = models.FloatField(null=True, db_column='stat')
    p_value = models.FloatField(null=True, db_column='pvalue')
    padj = models.FloatField(null=True, db_column='padj')
    
    ensembl = models.CharField(max_length=255, db_column='ensembl', default="")
    entrezgene_id = models.IntegerField(db_column='entrezgene_id', default="")
    GeneName = models.CharField(max_length=255, db_column='GeneName', default="")

    CellLine = models.CharField(max_length=255, db_column='CellLine', default="")
    GSE = models.CharField(max_length=255, db_column='GSE', default="")
    Rep = models.IntegerField(db_column='Rep', default="")
    Dose = models.FloatField(null=True, db_column='Dose')
    
    Duration = models.CharField(max_length=255, db_column='Duration', default="")
    

    minus_log10padj = models.FloatField(null=True, db_column='minus_log10padj')

    class Meta:
        db_table = 'RNAseqData'


class SearchTableChipSeq(models.Model):
    """RNAseq table"""
    chr_num = models.CharField(max_length=255, db_column='chr', default="")
    start = models.IntegerField(db_column='start', null=True)
    end = models.IntegerField(db_column='end', null=True)
    peakid = models.CharField(max_length=255, db_column='peakid', default="")
    mid = models.IntegerField(db_column='mid', null=True)
    score = models.FloatField(null=True, db_column='score')
    GSE = models.CharField(max_length=255, db_column='GSE', default="")
    Cellline = models.CharField(max_length=255, db_column='Cellline', default="")
    Duration = models.CharField(max_length=255, db_column='Duration', default="")
    Dose = models.FloatField(null=True, db_column='Dose')

    class Meta:
        db_table = 'ChipSeqData'


class SearchTableChipSeqRefData(models.Model):
    """RNAseq table"""
    chr_num = models.CharField(max_length=255, db_column='chr', default="")
    tss = models.IntegerField(db_column='tss', null=True)
    tss_s = models.IntegerField(db_column='tss_s', null=True)
    tss_e = models.IntegerField(db_column='tss_e', null=True)
    generef = models.CharField(max_length=255, db_column='generef', default="")
    gene = models.CharField(max_length=255, db_column='gene', default="")
    strand = models.CharField(max_length=255, db_column='strand', default="")

    class Meta:
        db_table = 'ChipseqReference'

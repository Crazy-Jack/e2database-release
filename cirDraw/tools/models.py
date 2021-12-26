# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
import uuid

######## TABLE UPDATE ########
class chromosome_length(models.Model):
    """Store known chromosome length, fixed by existed knowledge."""
    id = models.AutoField(primary_key=True)
    assembly = models.CharField(max_length=100)
    chr_num = models.CharField(max_length=50)
    chr_length = models.IntegerField()

    class Meta:
        db_table = 'chromosome_length'
        managed = False

class circ_disease(models.Model):
    """Store known chromosome length, fixed by existed knowledge."""
    id = models.AutoField(primary_key=True)
    assembly = models.CharField(max_length=100)
    chr_num = models.CharField(max_length=50)
    start = models.IntegerField()
    end = models.IntegerField()
    name = models.CharField(max_length=255)
    disease = models.CharField(max_length=255)

    class Meta:
        db_table = 'circ_disease'
        managed = False

# Species genome
_assembly = ['hg19', 'hg38', 'rn6', 'danRer11', 'sacCer3', 'mm10']

class species_genome_genes(models.Model):
    """Mother class for species genome gene tables"""
    chr_num = models.CharField(max_length=50)
    start = models.IntegerField()
    end = models.IntegerField()
    strand = models.CharField(max_length=2)
    id_en = models.CharField(db_column='id', max_length=255, primary_key=True)
    name = models.CharField(max_length=255)
    gene_type = models.CharField(max_length=100)



class species_genome_transcripts(models.Model):
    """Mother class for species genome transcript"""
    gene = models.CharField(max_length=255)
    chr_num = models.CharField(max_length=50)
    start = models.IntegerField()
    end = models.IntegerField()
    strand = models.CharField(max_length=2)
    id_en = models.CharField(db_column='id', max_length=255, primary_key=True)
    name = models.CharField(max_length=255)

class species_genome_exons_introns(models.Model):
    """Mother class for species genome exons introns"""
    gene = models.CharField(max_length=255)
    transcript = models.CharField(max_length=255)
    exin_type = models.CharField(max_length=255)
    chr_num = models.CharField(max_length=50)
    start = models.IntegerField()
    end = models.IntegerField()
    strand = models.CharField(max_length=2)
    id_en = models.CharField(db_column='id', max_length=255)
    name = models.CharField(max_length=255)
    modifications = models.TextField()
    id_notuse = models.AutoField(primary_key=True)

class species_circRNAs(models.Model):
    """Mother class for species_circRNAs"""
    gene = models.CharField(max_length=255)
    transcript = models.CharField(max_length=255)
    chr_num = models.CharField(max_length=50)
    start = models.IntegerField()
    end = models.IntegerField()
    components = models.TextField()





_genes_scripts = """class {}_species_genome_genes(species_genome_genes):
    class Meta:
        db_table = '{}_genome_genes'
        managed = False"""

_transcripts_scripts = """class {}_species_genome_transcripts(species_genome_transcripts):
    class Meta:
        db_table = '{}_genome_transcripts'
        managed = False"""

_exinons_scripts = """class {}_species_genome_exons_introns(species_genome_exons_introns):
    class Meta:
        db_table = '{}_genome_exons_introns'
        managed = False"""

_circRNAs_scripts = """class {}_species_circRNAs(species_circRNAs):
    class Meta:
        db_table = '{}_circRNAs'
        managed = False"""


for i in _assembly:
    exec(_genes_scripts.format(i, i))
    exec(_transcripts_scripts.format(i, i))
    exec(_exinons_scripts.format(i, i))
    exec(_circRNAs_scripts.format(i, i))

# class hg38_species_genome_genes(species_genome_genes):
#     """hg38 species_genome_genes"""
#     class Meta:
#         db_table = 'hg38_species_genome_genes'
#         managed = False
#
# class rn6_species_genome_genes(species_genome_genes):
#     """rn6 species_genome_genes"""
#     class Meta:
#         db_table = 'rn6_species_genome_genes'
#         managed = False
#
# class danRer11_species_genome_genes(species_genome_genes):
#     """danRer11 species_genome_genes"""
#     class Meta:
#         db_table = 'danRer11_species_genome_genes'
#         managed = False
#
#
# class sacCer3_species_genome_genes(species_genome_genes):
#     """sacCer3 species_genome_genes"""
#     class Meta:
#         db_table = 'sacCer3_species_genome_genes'
#         managed = False
#
# class mm10_species_genome_genes(species_genome_genes):
#     """mm10 species_genome_genes"""
#     class Meta:
#         db_table = 'mm10_species_genome_genes'
#         managed = False

# Special genome


class UserTable(models.Model):
    """User table, store processed results"""
    md5 = models.CharField(max_length=255)
    gene_id = models.CharField(max_length=255, db_column='gene_id', default='')
    chr_num = models.CharField(max_length=100)
    start = models.IntegerField()
    end = models.IntegerField()
    name = models.CharField(max_length=255)
    gene_type = models.CharField(max_length=100)
    circ_on_gene_all = models.TextField()
    circ_on_num = models.IntegerField()

    class Meta:
        db_table = 'UserTable'

class UserDensity(models.Model):
    """User table, store density info"""
    md5 = models.CharField(max_length=255)
    gene_id = models.CharField(max_length=255, db_column='gene_id',default='')
    chr_num = models.CharField(max_length=100)
    start = models.IntegerField()
    end = models.IntegerField()
    name = models.CharField(max_length=255)
    gene_type = models.CharField(max_length=100)
    circ_num = models.IntegerField()

    class Meta:
        db_table = 'UserDensity'

class StatisticTable(models.Model):
    """User table, store statistic result"""
    md5 = models.CharField(max_length=255, primary_key=True)
    lenChart = models.TextField()
    toplist = models.TextField()

    class Meta:
        db_table = 'StatisticTable'

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



######## END of TABLE UPDATE ########
# class ToolsChromosome(models.Model):
#     caseid = models.ForeignKey('UploadParametersMD5', on_delete=models.CASCADE, blank=True, null=True)
#     chr_ci = models.CharField(max_length=50)
#     chr_start = models.IntegerField()
#     chr_end = models.IntegerField()
#     max_length_circ = models.IntegerField()
#     min_length_circ = models.IntegerField()

#     class Meta:
#         db_table = 'tools_chromosome'

# class ToolsScalegenome(models.Model):
#     species = models.CharField(max_length=255)
#     chr_ci = models.CharField(max_length=30)
#     gene_min_start = models.IntegerField()
#     gene_max_end = models.IntegerField()
#     genelens_wiki = models.IntegerField()

#     class Meta:
#         managed = False
#         db_table = 'tools_scalegenome'


# class ToolsAnnotation(models.Model):
#     gene_type = models.CharField(max_length=50)
#     gene_name = models.CharField(max_length=200)
#     chr_ci = models.CharField(max_length=50)
#     gene_start = models.IntegerField()
#     gene_end = models.IntegerField()
#     gene_id = models.CharField(max_length=200, primary_key=True)
#     species = models.CharField(max_length=200)

#     class Meta:
#         managed = False
#         db_table = 'tools_annotation'


#class ToolsEachobservation(models.Model):
#    circRNA_ID = models.CharField(db_column='circRNA_ID', max_length=200)  # Field name made lowercase.
#    chr_ci = models.CharField(max_length=40, blank=True, null=True)
#    circRNA_start = models.IntegerField(db_column='circRNA_start', blank=True, null=True)  # Field name made lowercase.
#    circRNA_end = models.IntegerField(db_column='circRNA_end', blank=True, null=True)  # Field name made lowercase.
#    SM_MS_SMS = models.CharField(db_column='SM_MS_SMS', max_length=40, blank=True, null=True)  # Field name made lowercase.
#    junction_reads = models.IntegerField(blank=True, null=True)
#    non_junction_reads = models.IntegerField(blank=True, null=True)
#    junction_reads_ratio = models.FloatField(blank=True, null=True)
#    circRNA_type = models.CharField(db_column='circRNA_type', max_length=40, blank=True, null=True)  # Field name made lowercase.
#    gene_id = models.CharField(max_length=100, blank=True, null=True)
#    strand = models.CharField(max_length=100, blank=True, null=True)
#    junction_reads_id = models.CharField(db_column='junction_reads_ID', max_length=500, blank=True, null=True)  # Field name made lowercase.
#    caseid = models.ForeignKey('UploadParametersMD5', on_delete=models.CASCADE, blank=True, null=True)
#    circ_id = models.AutoField(primary_key=True)
#    class Meta:
#        db_table = 'tools_eachobservation'



class UploadParametersMD5(models.Model):
    md5 = models.CharField(db_column="MD5", max_length = 32, primary_key = True)
    status = models.IntegerField(db_column="Status")
    file_type = models.CharField(db_column="FileType", max_length = 100)
    path = models.CharField(db_column="path", max_length=200)
    species = models.CharField(db_column="Species", max_length = 255)
    #denvalue = models.IntegerField(db_column = "denvalue")
    time = models.FloatField(db_column = "time_created")


    class Meta:
        db_table = 'tools_uploadmd5'



#class ToolsModM1A(models.Model):
#    chromosome = models.CharField(db_column="chromosome", max_length = 20)
#    modStart = models.IntegerField(db_column="modStart")
#    modEnd = models.IntegerField(db_column="modEnd")
#    strand = models.CharField(db_column="strand", max_length=2)
#    pubmedId = models.CharField(db_column="pubmedId", max_length=255)
#    link = models.CharField(db_column="link", max_length=1000)
#    disease = models.CharField(db_column="disease", max_length=500)
#    SNPid = models.CharField(db_column="SNPid", max_length=200)
#
#    class Meta:
#        managed = False
#        db_table = 'tools_m1a'
#
#
#class ToolsModM5C(models.Model):
#    chromosome = models.CharField(db_column="chromosome", max_length = 20)
#    modStart = models.IntegerField(db_column="modStart")
#    modEnd = models.IntegerField(db_column="modEnd")
#    strand = models.CharField(db_column="strand", max_length=2)
#    pubmedId = models.CharField(db_column="pubmedId", max_length=255)
#    link = models.CharField(db_column="link", max_length=1000)
#    disease = models.CharField(db_column="disease", max_length=500)
#    SNPid = models.CharField(db_column="SNPid", max_length=200)
#
#    class Meta:
#        managed = False
#        db_table = 'tools_m5c'
#
#class ToolsModM6A(models.Model):
#    chromosome = models.CharField(db_column="chromosome", max_length = 20)
#    modStart = models.IntegerField(db_column="modStart")
#    modEnd = models.IntegerField(db_column="modEnd")
#    strand = models.CharField(db_column="strand", max_length=2)
#    pubmedId = models.CharField(db_column="pubmedId", max_length=255)
#    link = models.CharField(db_column="link", max_length=1000)
#    disease = models.CharField(db_column="disease", max_length=500)
#    SNPid = models.CharField(db_column="SNPid", max_length=200)
#
#    class Meta:
#        managed = False
#        db_table = 'tools_m6a'
